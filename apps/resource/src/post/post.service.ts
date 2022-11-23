export default class PostService {
    async getPosts() {
        return [{
            id: 1,
            title: 'Post 1',
            content: 'Content 1'
        }];
    }
}