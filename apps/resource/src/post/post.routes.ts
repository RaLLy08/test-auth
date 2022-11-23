import { Router } from "express";

import PostController from "./post.controller";

const { getPosts } = new PostController();


export default (router: Router) => {
    router.get("/post", getPosts);
}
