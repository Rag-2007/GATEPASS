import { Injectable , NotFoundException , BadRequestException , UnauthorizedException} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { signAccessToken , signRefreshToken , verifyAccessToken , verifyRefreshToken } from './helper/jwt.helper';
import { AuthRepository } from './auth.repository';
import { scrypt as _scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'util';
import { SignupDto } from './dto/signup.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(public authrepo :AuthRepository){}

    async signup(body:SignupDto) {
        const existing = await this.authrepo.findUserByEmail(body.Email);
        if (existing) {
            throw new BadRequestException('Email already exists');
        }
        const salt = randomBytes(8).toString('hex');
        const hash =(await scrypt(body.password,salt,32)) as Buffer;
        const storedPassword = hash.toString('hex') + '*' + salt;
        const uid = await this.authrepo.createUser({
            Name: body.Name,
            Email: body.Email,
            PhoneNo: body.PhoneNo,
            Role: body.role,
            Password_Hash: storedPassword,
            RefreshToken: null,
        });
        return {UserID:uid,message:'User created successfully'};
    }

    async updateUser(userId: string,data: any){
        const salt = randomBytes(8).toString('hex');
        const hash =(await scrypt(data.Password,salt,32)) as Buffer;
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

    async ValidateandGenerateTokens(body:LoginDto){

        let email = body.Email ;
        let pass = body.password ;
        let role = body.role ;

        const storedHash = await this.authrepo.findOne(email,role) ;

        if(!storedHash){
            throw new NotFoundException('User not found');
        }

        const [pass_stored , salt] = storedHash.split('*') ;
        const newHash = (await scrypt(pass, salt, 32)) as Buffer;

        if(newHash.toString('hex') !== pass_stored){
            throw new BadRequestException('Wrong password');
        }
        const accessToken = signAccessToken({ email, role });
        const refreshToken = signRefreshToken({email , role});
        const UserID = await this.authrepo.findUID(email) ;
        return { accessToken, refreshToken, UserID};
    }

    async setRefreshToken(UserID:any,refreshtoken:string){
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(refreshtoken, salt, 32)) as Buffer;
        const store = hash.toString('hex') +'*'+ salt ;
        await this.authrepo.setRefreshToken(UserID,store) ;
    }

    async deleteRefreshToken(UserID:string){
        console.log(UserID);
        await this.authrepo.deleteToken(UserID) ;
    } 

    async RotateTokens(body:RefreshDto) {
        
        let userid = body.userId ;
        let reftok = body.refreshToken ;

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
        const newHash = (await scrypt(reftok,salt,32)) as Buffer;

        if(newHash.toString('hex')!== storedHash){
            throw new UnauthorizedException(
                'Refresh token mismatch'
            );
        }

        let email = await this.authrepo.findEmail(userid) ;
        let role = await this.authrepo.findRole(userid) ;

        const accessToken = signAccessToken({ email, role });
        const refreshToken = signRefreshToken({email , role});
        return { accessToken, refreshToken, userid};
    }

}