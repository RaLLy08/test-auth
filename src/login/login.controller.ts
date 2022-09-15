import { Request, Response } from "express";
import { prop } from 'ramda';

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
        const refreshToken = JwtTokenService.makeRefreshToken(user.login);

        await this.jwtTokenService.setRefreshToken(refreshToken, user.id, deviceFingerprint, ip);

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

    updateTokens = async (req: Request, res: Response) => {
        const oldRefreshToken: string = prop(JwtTokenService.COOKIE_REFRESH_TOKEN)(req.cookies);
  
        const dbRefreshToken = await this.jwtTokenService.findByToken(oldRefreshToken);

        if (!dbRefreshToken) {
            return res.status(400).json({ message: "User is not authorized" });
        }

        const decoded = JwtTokenService.decodeRefreshToken(dbRefreshToken.token);

        const user = await this.loginService.findByLogin(decoded.login);

        const accessToken = JwtTokenService.makeAccessToken(user);
        const newRefreshToken = JwtTokenService.makeRefreshToken(decoded.login);

        this.jwtTokenService.updateRefreshTokenById(dbRefreshToken.id, newRefreshToken);

        JwtTokenService.setCookieRefreshToken(res, newRefreshToken);
        
        return res.status(200).json({ accessToken });;
    }

    deleteRefreshToken = async(req: Request, res: Response) => {
        const refreshToken: string = prop(JwtTokenService.COOKIE_REFRESH_TOKEN)(req.cookies);

        await this.jwtTokenService.deleteRefreshToken(refreshToken);

        JwtTokenService.removeCookieRefreshToken(res);

        return res.status(200).end();
    } 
}

