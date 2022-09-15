import { Router } from "express";

import LoginController from "./login.controller";
import { signinSchema, signupSchema } from './login.validationSchema';
import validateRequestMiddleware from '../middlewares/schemaValidator.middleware';
import { accessTokenMiddleware, refreshTokenMiddleware } from "../auth/jwt-validate.middleware";

const { signin, signup, updateTokens, deleteRefreshToken } = new LoginController();


export default (router: Router) => {
    router.post("/signin", validateRequestMiddleware(signinSchema), signin);
    router.post("/signup", validateRequestMiddleware(signupSchema), signup);
    router.post("/refreshToken", refreshTokenMiddleware(), updateTokens);
    router.delete("/refreshToken", refreshTokenMiddleware(), deleteRefreshToken);
}
