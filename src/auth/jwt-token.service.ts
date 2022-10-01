import { Response } from "express";
import { decode, sign } from "jsonwebtoken";
import { assoc, dissoc, any, isNil } from "ramda";
import refreshTokenModel from "../models/refresh-token.model";

import { User } from './../interfaces/user.interface';

interface JWTDefaultPayload {
    iat: number;
    exp: number;
}

export interface JwtAccessDecoded extends JWTDefaultPayload, Omit<User, 'password'> {
    login: string;
    id: number;
    type: 'access';
}

export default class JwtTokenService {
    constructor() {
        if (any(isNil)([
            process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SEC,
            process.env.JWT_SECRET,
        ])) {
            throw new Error('JWT env variables are not set');
        }
    }

    static COOKIE_REFRESH_TOKEN = 'refresh-token';

    static setCookieRefreshToken(res: Response, refreshToken: string) {
        res.cookie(JwtTokenService.COOKIE_REFRESH_TOKEN, refreshToken, {
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

    static decodeAccessToken(token: string) {
        const decoded = decode(token) as JwtAccessDecoded;

        if (decoded.type !== 'access') throw new Error('Wrong token type');

        return decoded;
    }

    async findByUserId(userId: number) {
        return await refreshTokenModel.findByUserId(userId);
    }

    async findByTokenIpFingerprint(token: string, deviceFingerprint: string, ip: string) {
        return await refreshTokenModel.findByTokenIpFingerprint(token, deviceFingerprint, ip);
    }

    async findByUserIpFingerprint(userId: number, deviceFingerprint: string, ip: string) {
        return await refreshTokenModel.findByUserIpFingerprint(userId, deviceFingerprint, ip);
    }

    async updateByUserIpFingerprint(userId: number, deviceFingerprint: string, refreshToken: string, ip: string) {
        await refreshTokenModel.updateByUserIpFingerprint(userId, deviceFingerprint, refreshToken, ip);
    }

    async create(userId: number, deviceFingerprint: string, refreshToken: string, ip: string) {
        await refreshTokenModel.create(userId, deviceFingerprint, refreshToken, ip);
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