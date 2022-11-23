import type { Request, Response } from "express";
import { prop } from 'ramda';
import { randomUUID } from "crypto";

import LoginService from "./login.service";
import { makeHash, verifyPassword } from './../helpers/scrypt';
import JwtTokenService from "../auth/jwt-token.service";

export default class LoginController {
    private loginService = new LoginService();
    private jwtTokenService = new JwtTokenService();

    signin = async (req: Request, res: Response) => {
        const { login, password, deviceFingerprint } = req.body;
        const ip = req.socket.remoteAddress || '';

        const user = await this.loginService.findByLogin(login);

        if (!user) return res.status(400).json({ message: 'Invalid login or password' });

        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) return res.status(400).json({ message: 'Invalid login or password' });
        
        const accessToken = JwtTokenService.makeAccessToken(user);
        const refreshToken = randomUUID();

        /**
         * Creates tokens for the user based on device, ip fingerprint,
         * Updates token at device for user by device, ip fingerprint if exists
         * user1 -> tokens[fingeriprint1, fingerprint2...]
         */
        const userRefreshTokenAtDevice = await this.jwtTokenService.findByUserIpFingerprint(user.id, deviceFingerprint, ip);

        if (userRefreshTokenAtDevice) { 
            await this.jwtTokenService.updateByUserIpFingerprint(user.id, deviceFingerprint, refreshToken, ip);
        } else {
            await this.jwtTokenService.create(user.id, deviceFingerprint, refreshToken, ip);
        }

        JwtTokenService.setCookieRefreshToken(res, refreshToken);

        return res.json({ accessToken });
    }
    
    signup = async (req: Request, res: Response) => {
        const { login, password } = req.body;

        const isUserExists = await this.loginService.findByLogin(login);

        if (isUserExists) return res.status(409).json({ message: 'User already exists' });
        
        await this.loginService.createUser(login, await makeHash(password));

        return res.status(200).end();
    }

    refreshTokens = async (req: Request, res: Response) => {
        const { deviceFingerprint } = req.body;
        const ip = req.socket.remoteAddress || '';
        const oldRefreshToken: string = prop(JwtTokenService.COOKIE_REFRESH_TOKEN)(req.cookies);
  
        // find refresh token at device and ip
        const dbRefreshToken = await this.jwtTokenService.findByTokenIpFingerprint(oldRefreshToken, deviceFingerprint, ip);
        
        if (!dbRefreshToken) {
            return res.status(400).json({ message: "User is not authorized" });
        }

        const user = await this.loginService.findById(dbRefreshToken.user_id);

        const refreshToken = randomUUID();
        const accessToken = JwtTokenService.makeAccessToken(user);

        // update refresh token at device and ip
        await this.jwtTokenService.updateByUserIpFingerprint(user.id, deviceFingerprint, refreshToken, ip);

        JwtTokenService.setCookieRefreshToken(res, refreshToken);

        return res.status(200).json({ accessToken });;
    }

    getRefreshTokens = async (req: Request, res: Response) => {
        const { id } = req.accessDecoded;
       
        return res.json({ activeSessions: await this.jwtTokenService.findByUserId(id) });
    }

    deleteRefreshToken = async(req: Request, res: Response) => {
        const refreshToken: string = prop(JwtTokenService.COOKIE_REFRESH_TOKEN)(req.cookies);

        await this.jwtTokenService.deleteRefreshToken(refreshToken);

        JwtTokenService.removeCookieRefreshToken(res);

        return res.status(200).end();
    } 
}

