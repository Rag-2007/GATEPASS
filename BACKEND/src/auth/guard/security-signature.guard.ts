import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SecuritySignatureGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const sig = request.headers['x-security-sig'] as string | undefined;

    if (!sig) {
      throw new ForbiddenException('Missing security signature');
    }

    const parts = sig.split('::');
    if (parts.length !== 3) {
      throw new ForbiddenException('Invalid signature format');
    }

    const [secret, _timestampStr, _qrId] = parts;
    const expectedSecret = process.env.SECURITY_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      throw new ForbiddenException('Invalid security secret');
    }

    return true;
  }
}

