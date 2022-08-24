import { Router } from 'express';

import loginRoutes from './login/login.routes';


const routes = [
    loginRoutes
];

export default () => {
    const router = Router();

    routes.forEach((route) => route(router));

    return router;
}