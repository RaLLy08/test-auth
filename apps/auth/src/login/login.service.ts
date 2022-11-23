import userModel from "../models/user.model";

export default class LoginService {

    async createUser(login: string, password: string) {
        return await userModel.create(login, password);
    }

    async findByLogin(login: string) {
        return await userModel.findByLogin(login);
    }

    async findById(id: number) {
        return await userModel.findById(id);
    }
}