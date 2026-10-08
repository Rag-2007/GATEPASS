import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from './helper/jwt.helper';
import { AuthRepository } from './auth.repository';
import { scrypt as _scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'util';
import { SignupDto } from './dto/signup.dto';

import { MailService } from '../mail/mail.service';
import { PasswordTokenRepository } from './password-token.repository';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        public authrepo: AuthRepository,
        private readonly passwordTokenRepository: PasswordTokenRepository,
        private readonly mailService: MailService,
    ) { }

    async signup(body: SignupDto) {
        const existing = await this.authrepo.findUserByEmail(body.Email);
        if (existing) {
            throw new BadRequestException('Email already exists');
        }
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(body.password, salt, 32)) as Buffer;
        const storedPassword = hash.toString('hex') + '*' + salt;
        const userId = await this.authrepo.createUser({
            Name: body.Name,
            Email: body.Email,
            PhoneNo: body.PhoneNo,
            Role: body.role,
            Password_Hash: storedPassword,
            RefreshToken: null,
        });
        return { UserID: userId, message: 'User created successfully' };
    }

    async updateUser(userId: string, data: any) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(data.Password, salt, 32)) as Buffer;
        const storedPassword = hash.toString('hex') + '*' + salt;
        await this.authrepo.updateUser(
            userId,
            {
                Name: data.Name,
                Email: data.Email,
                PhoneNo: data.PhoneNo,
                Password_Hash: storedPassword,
            },
        );
    }

    async updateMe(email: string, data: { Name?: string; Phone?: string; PhoneNo?: string }) {
        const user = await this.authrepo.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        try {
            await this.authrepo.updateUser(user.Id, {
                Name: data.Name,
                Phone: data.Phone ?? data.PhoneNo,
            });
            return { message: 'Profile updated successfully' };
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new BadRequestException('This phone number is already registered to another account.');
            }
            throw error;
        }
    }

    async ValidateandGenerateTokens(body: LoginDto) {

        let email = body.Email;
        let pass = body.password;
        let role = body.role;

        const storedHash = await this.authrepo.findOne(email, role);

        if (!storedHash) {
            throw new NotFoundException('User not found');
        }

        const [pass_stored, salt] = storedHash.Password_Hash.split('*');
        const newHash = (await scrypt(pass, salt, 32)) as Buffer;

        if (newHash.toString('hex') !== pass_stored) {
            throw new BadRequestException('Wrong password');
        }
        const accessToken = signAccessToken({ email, role });
        const refreshToken = signRefreshToken({ email, role });
        const UserID = await this.authrepo.findUID(email);
        return { accessToken, refreshToken, UserID };
    }

    async setRefreshToken(UserID: any, refreshtoken: string) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(refreshtoken, salt, 32)) as Buffer;
        const store = hash.toString('hex') + '*' + salt;
        await this.authrepo.setRefreshToken(UserID, store);
    }

    async deleteRefreshToken(UserID: string) {
        console.log(UserID);
        await this.authrepo.deleteToken(UserID);
    }

    async RotateTokens(body: RefreshDto) {

        let userid = body.userId;
        let reftok = body.refreshToken;

        try {
            verifyRefreshToken(reftok);

        } catch {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        const storedToken = await this.authrepo.getRefreshToken(userid);

        if (!storedToken) {
            throw new UnauthorizedException(
                'No refresh token found',
            );
        }

        const [storedHash, salt] = storedToken.split('*');
        const newHash = (await scrypt(reftok, salt, 32)) as Buffer;

        if (newHash.toString('hex') !== storedHash) {
            throw new UnauthorizedException(
                'Refresh token mismatch'
            );
        }

        let email = await this.authrepo.findEmail(userid);
        let role = await this.authrepo.findRole(userid);

        const accessToken = signAccessToken({ email, role });
        const refreshToken = signRefreshToken({ email, role });
        return { accessToken, refreshToken, userid };
    }

    async forgotPassword(email: string) {
        const user = await this.authrepo.findUserByEmail(email);
        if (!user) {
            return { message: 'If an account with that email exists, a password reset link has been sent.' };
        }

        const token = await this.passwordTokenRepository.createToken(user.Id);
        const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
        const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

        await this.mailService.sendPasswordResetEmail({
            to: user.Email,
            userName: user.Name,
            resetUrl,
        }).catch(err => console.error('Failed to send password reset email:', err));

        return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    async resetPassword(token: string, newPassword: string) {
        const result = await this.passwordTokenRepository.consumeToken(token);
        if (!result) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
        const storedPassword = hash.toString('hex') + '*' + salt;

        await this.authrepo.updateUser(result.userId, {
            Password_Hash: storedPassword,
        });

        return { message: 'Password has been successfully reset' };
    }
}
