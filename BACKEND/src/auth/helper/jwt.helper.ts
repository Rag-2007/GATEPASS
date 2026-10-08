import * as jwt from 'jsonwebtoken';

export function signAccessToken(payload: object): string {
    const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '45m' });
}

export function signRefreshToken(payload: object): string {
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '120d' });
}

export function verifyAccessToken(token: string): any {
    const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
    return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): any {
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
    return jwt.verify(token, REFRESH_SECRET);
}
