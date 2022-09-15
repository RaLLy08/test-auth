export type Hash = `${string}:${string}`

export interface User {
    login: string;
    password: Hash;
    id: number;
}