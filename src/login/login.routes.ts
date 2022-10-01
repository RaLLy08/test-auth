import { Router } from "express";

import LoginController from "./login.controller";
import { signinSchema, signupSchema, refreshTokensSchema } from './login.validationSchema';
import validateRequestMiddleware from '../middlewares/schemaValidator.middleware';
import { accessTokenMiddleware } from "../auth/jwt-validate.middleware";

const { signin, signup, refreshTokens, deleteRefreshToken, getRefreshTokens } = new LoginController();


export default (router: Router) => {
    router.post("/signin", validateRequestMiddleware(signinSchema), signin);
    router.post("/signup", validateRequestMiddleware(signupSchema), signup);
    router.post("/refreshTokens", validateRequestMiddleware(refreshTokensSchema), refreshTokens);
    router.delete("/refreshTokens", deleteRefreshToken);
    router.get("/refreshTokens", accessTokenMiddleware(), getRefreshTokens);
}
