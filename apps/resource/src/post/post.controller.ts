import { Request, Response } from "express";

import PostService from "./post.service";

export default class PostController {
    private postService = new PostService();

    getPosts = async (req: Request, res: Response) => {
        const posts = await this.postService.getPosts();
        // rmqSend(req.body);


        return res.json(posts).end();
    }
}