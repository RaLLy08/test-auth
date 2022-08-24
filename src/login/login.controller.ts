import { Request, Response } from "express";
import LoginService from "./login.service";

export default class LoginController {
    private loginService = new LoginService();

    loginUser = (req: Request, res: Response) => {
        const user = this.loginService.createUser();

        return res.json(user);
    }
}