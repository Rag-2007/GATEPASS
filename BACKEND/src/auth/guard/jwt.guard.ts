import {Injectable,CanActivate,ExecutionContext,UnauthorizedException} from '@nestjs/common';
import { verifyAccessToken } from '../helper/jwt.helper';

@Injectable()
export class JwtGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new UnauthorizedException('Missing access token',);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyAccessToken(token);
        request.user = payload;
        return true;
    }
    catch {
        throw new UnauthorizedException('Invalid access token',);
    }
  }
}