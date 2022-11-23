import { Router } from 'express';

import postRoutes from './post/post.routes';


const routes = [
    postRoutes
];

export default () => {
    const router = Router();

    routes.forEach((route) => route(router));

    return router;
}