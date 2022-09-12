import client from "../db/pg";

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

    async create(login: string, password: string) {
        const {rows: [row]} = await client.query(`INSERT INTO users (login, password) VALUES ('${login}', '${password}') RETURNING *`);

        return row;
    }

    async findById(id: string) {
        return client.query(`SELECT * FROM users WHERE id = '${id}'`);
    }

    async findByLogin(login: string) {
        const {rows: [row]} = await client.query(`SELECT * FROM users WHERE login = '${login}'`);

        return row;
    }
}

export default new UserModel();