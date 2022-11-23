import { RefreshTokenInterface } from './../interfaces/refresh-token.interface';
import client from "../db/pg";

class RefreshTokenModel {
    constructor() {
        client.query(`
            CREATE TABLE IF NOT EXISTS "refresh-token" (
                id SERIAL PRIMARY KEY,
                token VARCHAR(255) NOT NULL,
                device_fingerprint VARCHAR(255) NOT NULL,
                user_id INTEGER NOT NULL,
                ip VARCHAR(255) NOT NULL,
                createdAt timestamp with time zone NOT NULL DEFAULT now(),
                FOREIGN KEY (user_id) REFERENCES "user"(id)
            )
        `)
    }

    async create(userId: number, deviceFingerprint: string, token: string, ip: string): Promise<RefreshTokenInterface> {
        const query = {
            text: 'INSERT INTO "refresh-token" (token, user_id, device_fingerprint, ip) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [token, userId, deviceFingerprint, ip],
        };

        const {rows: [row]} = await client.query(query);

        return row;
    }

    async updateByUserId(userId: number, token: string): Promise<RefreshTokenInterface> {
        const query = {
            text: `UPDATE "refresh-token" SET token = $1 WHERE user_id = $2 RETURNING *`,
            values: [token, userId],
        };

        const {rows: [row]} = await client.query(query);

        return row;
    }

    async updateById(id: number, newRefreshToken: string) {
        const query = {
            text: `UPDATE "refresh-token" SET token = $1 WHERE id = $2`,
            values: [newRefreshToken, id],
        };

        await client.query(query);
    }

    async findByUserId(userId: number): Promise<RefreshTokenInterface[]> {
        const query = {
            text: `SELECT * FROM "refresh-token" WHERE user_id = $1`,
            values: [userId],
        };

        const { rows } = await client.query(query);

        return rows;
    }

    async updateByUserIpFingerprint(userId: number, fingerprint: string, token: string, ip: string): Promise<RefreshTokenInterface> {
        const query = {
            text: `UPDATE "refresh-token" SET token = $1 where ("user_id"=$2 and "device_fingerprint"=$3 and "ip"=$4) RETURNING *`,
            values: [token, userId, fingerprint, ip],
        };

        const {rows: [row]} = await client.query(query);
    
        return row;
    }
    
    async findByUserIpFingerprint(userId: number, fingerprint: string, ip: string): Promise<RefreshTokenInterface> {
        const query = {
            text: `SELECT * from "refresh-token" where ("user_id"=$1 and "device_fingerprint"=$2 and "ip"=$3)`,
            values: [userId, fingerprint, ip],
        };

        const { rows: [row]} = await client.query(query);

        return row;
    }

    async findByTokenIpFingerprint(token: string, fingerprint: string, ip: string): Promise<RefreshTokenInterface> {
        const query = {
            text: `SELECT * from "refresh-token" where ("token"=$1 and "device_fingerprint"=$2 and "ip"=$3)`,
            values: [token, fingerprint, ip],
        };

        const { rows: [row]} = await client.query(query);

        return row;
    }

    async findByToken(token: string): Promise<RefreshTokenInterface> {
        const query = {
            text: `SELECT * FROM "refresh-token" WHERE token = $1`,
            values: [token],
        };

        const { rows: [row] } = await client.query(query);

        return row;
    }

    async delete(token: string) {
        const query = {
            text: `DELETE FROM "refresh-token" WHERE token = $1`,
            values: [token],
        };

        await client.query(query);
    }
}

export default new RefreshTokenModel();