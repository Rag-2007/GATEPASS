import { Controller, Get, Post, Put, Body, Req, Res, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {

    constructor(public authservice: AuthService) { }

    @Post('/signup')
    async signupUser(@Body() body: SignupDto) {
        return await this.authservice.signup(body);
    }

    @Post('/login')
    async loginUser(@Body() body: LoginDto) {
        try {
            const { accessToken, refreshToken, UserID } = await this.authservice.ValidateandGenerateTokens(body);
            await this.authservice.setRefreshToken(UserID, refreshToken);
            return {
                accessToken, refreshToken, UserID
            };
        }
        catch (e) {
            throw e;
        }
    }

    @Post('/logout')
    async logoutUser(@Body() body: LogoutDto) {
        await this.authservice.deleteRefreshToken(body.userId);
        return {
            message: 'Logged out successfully',
        };
    }

    @Post('/refresh')
    async TokenRotation(@Body() body: RefreshDto) {
        try {
            const { accessToken, refreshToken, userid } = await this.authservice.RotateTokens(body);
            await this.authservice.setRefreshToken(userid, refreshToken);
            return {
                accessToken, refreshToken, userid
            };
        }
        catch (e) {
            throw e;
        }
    }

    @Put('/updateMe')
    @UseGuards(JwtGuard)
    async updateMe(@Req() req: any, @Body() body: { Name?: string; Phone?: string; PhoneNo?: string }) {
        const email = req.user.email;
        return await this.authservice.updateMe(email, body);
    }

    @Post('/forgot-password')
    async forgotPassword(@Body() body: { email: string }) {
        return await this.authservice.forgotPassword(body.email);
    }

    @Get('/reset-password')
    async getResetPasswordPage(@Query('token') token: string, @Res() res: any) {
        if (!token) {
            return res.type('html').send(renderResetPage('error', '', 'Invalid reset link. Token is missing.'));
        }
        return res.type('html').send(renderResetPage('form', token));
    }

    @Post('/reset-password')
    async resetPassword(
        @Body() body: { token: string; password?: string; newPassword?: string },
        @Res() res: any
    ) {
        const token = body.token;
        const newPassword = body.password || body.newPassword;

        if (!token || !newPassword) {
            return res.type('html').send(renderResetPage('error', token, 'Token or new password missing.'));
        }

        try {
            await this.authservice.resetPassword(token, newPassword);
            return res.type('html').send(renderResetPage('success', ''));
        } catch (e: any) {
            return res.type('html').send(renderResetPage('error', token, e.message || 'Failed to reset password. Link may be expired or already used.'));
        }
    }
}

function renderResetPage(type: 'form' | 'success' | 'error', token: string, message?: string): string {
    const commonHead = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Reset Password — Gatepass</title></head><body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;"><div style="background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.10);padding:48px 40px;max-width:420px;width:90%;text-align:center;">`;
    const commonFoot = `<p style="margin:24px 0 0;color:#9ca3af;font-size:12px;">IIIT Sri City Hostel Gatepass System</p></div></body></html>`;

    if (type === 'form') {
        return `${commonHead}
            <div style="width:72px;height:72px;border-radius:50%;background:#0D1B2A;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px;color:#FFE38A;font-weight:900;">🔒</div>
            <h1 style="margin:0 0 12px;color:#0D1B2A;font-size:24px;font-weight:800;">Reset Password</h1>
            <p style="margin:0 0 28px;color:#4b5563;font-size:15px;line-height:1.6;">Enter your new password below. Make sure it's strong and secure.</p>
            <form action="/auth/reset-password" method="POST" style="text-align:left;">
                <input type="hidden" name="token" value="${token}" />
                <label style="display:block;margin-bottom:8px;font-size:14px;color:#374151;font-weight:700;">New Password</label>
                <input type="password" name="password" required minlength="6" style="width:100%;box-sizing:border-box;padding:12px 16px;margin-bottom:24px;border:1px solid #d1d5db;border-radius:8px;font-size:15px;" placeholder="••••••••" />
                <button type="submit" style="width:100%;padding:14px 0;background:#0D1B2A;color:#FFE38A;border:none;border-radius:8px;font-size:15px;font-weight:800;cursor:pointer;">Update Password</button>
            </form>
        ${commonFoot}`;
    }

    if (type === 'success') {
        return `${commonHead}
            <div style="width:72px;height:72px;border-radius:50%;background:#15803d;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px;color:#fff;font-weight:900;">✓</div>
            <h1 style="margin:0 0 12px;color:#0D1B2A;font-size:24px;font-weight:800;">Password Updated</h1>
            <p style="margin:0 0 28px;color:#4b5563;font-size:15px;line-height:1.6;">Your password has been successfully reset. You can now close this tab and log in to the app with your new password.</p>
        ${commonFoot}`;
    }
    return `${commonHead}
        <div style="width:72px;height:72px;border-radius:50%;background:#b91c1c;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px;color:#fff;font-weight:900;">✗</div>
        <h1 style="margin:0 0 12px;color:#0D1B2A;font-size:24px;font-weight:800;">Reset Failed</h1>
        <p style="margin:0 0 28px;color:#4b5563;font-size:15px;line-height:1.6;">${message || 'An error occurred.'}</p>
    ${commonFoot}`;
}

