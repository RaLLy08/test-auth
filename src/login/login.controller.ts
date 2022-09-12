import { Request, Response } from "express";

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
        
        const accessToken = this.jwtTokenService.makeAccessToken(user);
        const refreshToken = await this.jwtTokenService.makeRefreshToken(user, deviceFingerprint, ip);

        res.cookie("refresh-token", refreshToken, {
            maxAge: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SEC! * 1000,
            httpOnly: true,
        });

        return res.json(accessToken);
    }
    
    signup = async (req: Request, res: Response) => {
        const { login, password } = req.body;

        const isUserExists = await this.loginService.findByLogin(login);

        if (isUserExists) return res.status(409).json({ message: 'User already exists' });
        
        await this.loginService.createUser(login, await makeHash(password));

        return res.status(200).end();
    }
}

