export interface RefreshTokenInterface {
    id: number;
    user_id: number;
    device_fingerprint: string;
    token: string;
    ip: string;
}