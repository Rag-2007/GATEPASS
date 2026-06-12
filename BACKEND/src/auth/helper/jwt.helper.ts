import * as jwt from 'jsonwebtoken';
export const ACCESS_SECRET = 'my_super_secret_access_key';
export const REFRESH_SECRET = 'my_super_secret_refresh_key';


export function signAccessToken(payload: object): string {
    return jwt.sign(
        payload,
        ACCESS_SECRET,
        { expiresIn: '45m' }
    );
}

export function signRefreshToken(payload: object): string {
    return jwt.sign(
        payload,
        REFRESH_SECRET,
        { expiresIn: '120d' }
    );
}

export function verifyAccessToken(token: string): any {
    return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): any {
    return jwt.verify(token, REFRESH_SECRET);
}