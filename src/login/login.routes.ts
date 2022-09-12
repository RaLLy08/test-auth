import { Router } from "express";

import LoginController from "./login.controller";
import { signinSchema, signupSchema } from './login.validationSchema';
import validateRequestMiddleware from '../middlewares/schemaValidator.middleware';

const { signin, signup } = new LoginController();


export default (router: Router) => {
    router.post("/signin", validateRequestMiddleware(signinSchema), signin);
    router.post("/signup", validateRequestMiddleware(signupSchema), signup);
}
