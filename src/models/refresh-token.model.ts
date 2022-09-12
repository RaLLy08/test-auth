import client from "../db/pg";

class RefreshTokenModel {
    constructor() {
        client.query(`
            CREATE TABLE IF NOT EXISTS "refresh-tokens" (
                id SERIAL PRIMARY KEY,
                token VARCHAR(255) NOT NULL,
                device_fingerprint VARCHAR(255) NOT NULL,
                user_id INTEGER NOT NULL,
                ip VARCHAR(255) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `)
    }

    async create(userId: number, deviceFingerprint: string, token: string, ip: string) {
        const {rows: [row]} = await client.query(`INSERT INTO "refresh-tokens" (token, user_id, device_fingerprint, ip) VALUES ('${token}', '${userId}', '${deviceFingerprint}', '${ip}') RETURNING *`);

        return row;
    }

    async updateByUserId(userId: number, token: string) {
        const {rows: [row]} = await client.query(`UPDATE "refresh-tokens" SET token = '${token}' WHERE user_id = '${userId}' RETURNING *`);

        return row;
    }

    async getByUserId(userId: number) {
        const { rows } = await client.query(`SELECT * FROM "refresh-tokens" WHERE user_id = '${userId}'`);

        return rows;
    }

    async updateByUserDeviceFingerprint(userId: number, fingerprint: string, token: string) {
        const {rows: [row]} = await client.query(`UPDATE "refresh-tokens" SET token = '${token}' where ("user_id"='${userId}' and "device_fingerprint"='${fingerprint}') RETURNING *`);
    
        return row;
    }
    
    async getUserDeviceFingerprint(userId: number, fingerprint: string) {
        const { rows: [row]} = await client.query(`SELECT * from "refresh-tokens" where ("user_id"='${userId}' and "device_fingerprint"='${fingerprint}')`);

        return row;
    }
}

export default new RefreshTokenModel();