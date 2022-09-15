import { Response } from "express";
import { decode, sign } from "jsonwebtoken";
import { assoc, dissoc, any, isNil, compose } from "ramda";
import refreshTokenModel from "../models/refresh-token.model";

import { User } from './../interfaces/user.interface';

interface JWTDefaultPayload {
    iat: number;
    exp: number;
}

interface JwtRefreshDecoded extends JWTDefaultPayload {
    login: string;
    type: 'refresh';
}

interface JwtAccessDecoded extends JWTDefaultPayload, Omit<User, 'password'> {
    login: string;
    type: 'access';
}

export default class JwtTokenService {
    constructor() {
        if (any(isNil)([
            process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SEC,
            process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SEC,
            process.env.JWT_SECRET,
        ])) {
            throw new Error('JWT env variables are not set');
        }
    }

    static COOKIE_REFRESH_TOKEN = 'refresh-token';

    static setCookieRefreshToken(res: Response, refreshToken: string) {
        res.cookie(JwtTokenService.COOKIE_REFRESH_TOKEN, refreshToken, {
            maxAge: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SEC! * 1000,
            httpOnly: true,
        });
    }

    static removeCookieRefreshToken(res: Response) {
        res.clearCookie(JwtTokenService.COOKIE_REFRESH_TOKEN);
    }
    /**
     * Makes unique access token signed with user entity
     */
    static makeAccessToken(user: User) {
        const payload = assoc('type', 'access')(dissoc('password', user));
        const expiresIn = +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SEC!;

        const token = sign(payload, process.env.JWT_SECRET!, {
            expiresIn,
        });

        return token;
    }
    /**
     * Makes unique refresh token besed on of login string
     */
    static makeRefreshToken(userLogin: string) {
        const payload = compose(
            assoc('type', 'refresh'),
            assoc('login', userLogin),
        )({});

        const expiresIn = +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SEC!;

        return sign(payload, process.env.JWT_SECRET!, {
            expiresIn,
        });
    }

    static decodeRefreshToken(token: string) {
        const decoded = decode(token) as JwtRefreshDecoded;

        if (decoded.type !== 'refresh') throw new Error('Wrong token type');
        
        return decoded;
    }

    static decodeAccessToken(token: string) {
        const decoded = decode(token) as JwtAccessDecoded;

        if (decoded.type !== 'access') throw new Error('Wrong token type');

        return decoded;
    }

    /**
     * Creates tokens for the user based on device fingerprint,
     * Updates token at device for user by device fingerprint if exists
     * user1 -> tokens[fingeriprint1, fingerprint2...]
     */
    async setRefreshToken(refreshToken: string, userId: number, deviceFingerprint: string, ip: string) { 
        const userRefreshTokenAtDevice = await refreshTokenModel.getUserDeviceFingerprint(userId, deviceFingerprint);

        if (userRefreshTokenAtDevice) {
            await refreshTokenModel.updateByUserDeviceFingerprint(userId, deviceFingerprint, refreshToken);
        } else {
            await refreshTokenModel.create(userId, deviceFingerprint, refreshToken, ip);
        };

        return refreshToken;
    }

    async updateRefreshTokenById(id: number, newRefreshToken: string) {
        await refreshTokenModel.updateById(id, newRefreshToken);
    }

    async findByToken(oldRefreshToken: string) {
        const dbRefreshToken = await refreshTokenModel.findByToken(oldRefreshToken);

        if (!dbRefreshToken) return;

        return dbRefreshToken;
    }

    async deleteRefreshToken(refreshToken: string) {
        await refreshTokenModel.delete(refreshToken);
    }
}