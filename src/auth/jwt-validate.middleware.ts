import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { pathOr, split, prop } from "ramda";
import JwtTokenService from "./jwt-token.service";


export const accessTokenMiddleware = () =>
    (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "OPTIONS") next();
        
        const token = split(
            " ", 
            pathOr("", ["headers", "authorization"], req)
        ).at(1);

        if (!token) {
            return res.status(403).json({message: "Token not provided"});
        }

        try {
            verify(token, process.env.JWT_SECRET!);

            next();
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                return res.status(403).json({message: "Token is expired", error});
            }

            return res.status(403).json({message: "User is not authorized", error});
        }
    };


export const refreshTokenMiddleware = () =>
    (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "OPTIONS") next();

        const refreshToken: string = prop(JwtTokenService.COOKIE_REFRESH_TOKEN)(req.cookies);

        try {
            verify(refreshToken, process.env.JWT_SECRET!);

            next();
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                return res.status(403).json({message: "Token is expired", error});
            }

            return res.status(400).json({message: "User is not authorized", error});
        }
        
    };


