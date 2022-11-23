import client from "../db/pg";
import { User } from "../interfaces/user.interface";

class UserModel {
    constructor() {
        client.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                id SERIAL PRIMARY KEY,
                login VARCHAR(255) NOT NULL,
                createdAt timestamp with time zone NOT NULL DEFAULT now(),
                password VARCHAR(255) NOT NULL
            )
        `)
    }

    async create(login: string, password: string): Promise<User> {
        const query = {
            text: 'INSERT INTO "user" (login, password) VALUES ($1, $2) RETURNING *',
            values: [login, password],
        };

        const {rows: [row]} = await client.query(query);

        return row;
    }

    async findById(id: number): Promise<User> {
        const query = {
            text: `SELECT * FROM "user" WHERE id = $1`,
            values: [id],
        };
        const {rows: [row]} = await client.query(query);

        return row;
    }

    async findByLogin(login: string): Promise<User> {
        const query = {
            text: `SELECT * FROM "user" WHERE login = $1`,
            values: [login],
        };

        const {rows: [row]} = await client.query(query);

        return row;
    }
}

export default new UserModel();