import client from "../db/pg";
import { User } from "../interfaces/user.interface";

class UserModel {
    constructor() {
        client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                login VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `)
    }

    async create(login: string, password: string): Promise<User> {
        const query = {
            text: 'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *',
            values: [login, password],
        };

        const {rows: [row]} = await client.query(query);

        return row;
    }

    async findById(id: string): Promise<User> {
        const query = {
            text: `SELECT * FROM users WHERE id = $1`,
            values: [id],
        };

        return client.query(query);
    }

    async findByLogin(login: string): Promise<User> {
        const query = {
            text: `SELECT * FROM users WHERE login = $1`,
            values: [login],
        };

        const {rows: [row]} = await client.query(query);

        return row;
    }
}

export default new UserModel();