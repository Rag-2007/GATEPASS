import * as jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export function signAccessToken(payload: object): string {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '45m' });
}

export function signRefreshToken(payload: object): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '120d' });
}

export function verifyAccessToken(token: string): any {
    return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): any {
    return jwt.verify(token, REFRESH_SECRET);
}
