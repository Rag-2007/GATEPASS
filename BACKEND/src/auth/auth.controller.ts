import { Controller , Post , Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {

    constructor(public authservice : AuthService){}

    @Post('/signup')
    async signupUser(@Body() body:SignupDto){
        return await this.authservice.signup(body);
    }

    @Post('/login')
    async loginUser(@Body() body:LoginDto) {
        try{
            const { accessToken, refreshToken , UserID} = await this.authservice.ValidateandGenerateTokens(body) ;
            await this.authservice.setRefreshToken(UserID,refreshToken) ;
            return {
                accessToken , refreshToken , UserID 
            };
        }
        catch(e){
            throw e ;
        }
    }

    @Post('/logout')
    async logoutUser(@Body() body:LogoutDto) {
        await this.authservice.deleteRefreshToken(body.userId) ;
        return {
            message: 'Logged out successfully',
        };
    }

    @Post('/refresh')
    async TokenRotation(@Body() body:RefreshDto){
        try{
            const { accessToken, refreshToken , userid} = await this.authservice.RotateTokens(body) ;
            await this.authservice.setRefreshToken(userid,refreshToken) ;
            return {
                accessToken , refreshToken , userid
            };
        }
        catch(e){
            throw e ;
        }
    } 

}

