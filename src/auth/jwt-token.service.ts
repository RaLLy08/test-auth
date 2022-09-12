import { sign } from "jsonwebtoken";
import { assoc, dissoc, any, isNil } from "ramda";
import refreshTokenModel from "../models/refresh-token.model";

import { User } from './../interfaces/user.interface';

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

    makeAccessToken(user: User) {
        const payload = assoc('type', 'access')(dissoc('password', user));
        const expiresIn = +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SEC!;

        const token = sign(payload, process.env.JWT_SECRET!, {
            expiresIn,
        });

        return token;
    }
    async makeRefreshToken(user: User, deviceFingerprint: string, ip: string) {
        const payload = assoc('type', 'refresh')(dissoc('password', user));
        const expiresIn = +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SEC!;

        const refreshToken = sign(payload, process.env.JWT_SECRET!, {
            expiresIn,
        });
        
        const userRefreshTokenAtDevice = await refreshTokenModel.getUserDeviceFingerprint(user.id, deviceFingerprint);

        if (userRefreshTokenAtDevice) {
            await refreshTokenModel.updateByUserDeviceFingerprint(user.id, deviceFingerprint, refreshToken);
        } else {
            await refreshTokenModel.create(user.id, deviceFingerprint, refreshToken, ip);
        };

        return refreshToken;
    }
}