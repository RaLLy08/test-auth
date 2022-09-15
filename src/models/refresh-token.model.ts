import { RefreshTokenInterface } from './../interfaces/refresh-token.interface';
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

    async create(userId: number, deviceFingerprint: string, token: string, ip: string): Promise<RefreshTokenInterface> {
        const query = {
            text: 'INSERT INTO "refresh-tokens" (token, user_id, device_fingerprint, ip) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [token, userId, deviceFingerprint, ip],
        };

        const {rows: [row]} = await client.query(query);

        return row;
    }

    async updateByUserId(userId: number, token: string): Promise<RefreshTokenInterface> {
        const query = {
            text: `UPDATE "refresh-tokens" SET token = $1 WHERE user_id = $2 RETURNING *`,
            values: [token, userId],
        };

        const {rows: [row]} = await client.query(query);

        return row;
    }

    async updateById(id: number, newRefreshToken: string) {
        const query = {
            text: `UPDATE "refresh-tokens" SET token = $1 WHERE id = $2`,
            values: [newRefreshToken, id],
        };

        await client.query(query);
    }

    async getByUserId(userId: number): Promise<RefreshTokenInterface[]> {
        const query = {
            text: `SELECT * FROM "refresh-tokens" WHERE user_id = $1`,
            values: [userId],
        };

        const { rows } = await client.query(query);

        return rows;
    }

    async updateByUserDeviceFingerprint(userId: number, fingerprint: string, token: string): Promise<RefreshTokenInterface> {
        const query = {
            text: `UPDATE "refresh-tokens" SET token = $1 where ("user_id"=$2 and "device_fingerprint"=$3) RETURNING *`,
            values: [token, userId, fingerprint],
        };

        const {rows: [row]} = await client.query(query);
    
        return row;
    }
    
    async getUserDeviceFingerprint(userId: number, fingerprint: string): Promise<RefreshTokenInterface> {
        const query = {
            text: `SELECT * from "refresh-tokens" where ("user_id"=$1 and "device_fingerprint"=$2)`,
            values: [userId, fingerprint],
        };

        const { rows: [row]} = await client.query(query);

        return row;
    }

    async findByToken(token: string): Promise<RefreshTokenInterface> {
        const query = {
            text: `SELECT * FROM "refresh-tokens" WHERE token = $1`,
            values: [token],
        };

        const { rows: [row] } = await client.query(query);

        return row;
    }

    async delete(token: string) {
        const query = {
            text: `DELETE FROM "refresh-tokens" WHERE token = $1`,
            values: [token],
        };

        await client.query(query);
    }
}

export default new RefreshTokenModel();