export interface Payload {
    id: number;
    username: string;
    authorities?: string[];
}

export interface RefreshTokenPayload {
    id: number;
}
