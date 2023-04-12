import type { NextFunction, Request, Response } from 'express';
import { pathOr, split } from 'ramda';

import rmq from "../rmq";


export function authMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "OPTIONS") next();
        
        const token = split(
            " ", 
            pathOr("", ["headers", "authorization"], req)
        ).at(1);

        if (!token) {
            return res.status(403).json({message: "Token not provided"});
        }

        rmq.send(token);

        const resp = await new Promise((resolve, reject) => {
            rmq.consume((msg) => {
                // if (msg === token)
                console.log('123')
                resolve(msg);
            });
        });

        
    }
}