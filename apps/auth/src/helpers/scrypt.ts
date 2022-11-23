import { scrypt, randomBytes } from 'crypto';
import { Hash } from '../interfaces/user.interface';

const scryptAsync = (key: string, salt: string): Promise<string> => new Promise((res, rej) => {
    scrypt(key, salt, 32, (err, derivedKey) => {
        if (err) rej(err);

        res(derivedKey.toString('hex'))
    });
});

export const makeHash = async (password: string): Promise<Hash> => {
    const salt = randomBytes(8).toString("hex");

    const hash = await scryptAsync(password, salt);

    return `${hash}:${salt}`;
}

export const verifyPassword = async (password: string, hash: Hash) => {
    const [key, salt] = hash.split(":");

    const passwordHash = await scryptAsync(password, salt);

    return key === passwordHash;
}

