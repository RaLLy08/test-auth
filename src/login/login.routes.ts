import { Router } from "express";

import LoginController from "./login.controller";

const { loginUser } = new LoginController();


export default (router: Router) => {
    router.post("/login", loginUser);
}
