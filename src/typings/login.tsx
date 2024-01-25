export interface LoginParams {
    login: string;
    password: string;
}

export interface SettingParams {
    server: string;
    port: string;
    login: string;
    password: string;
    db: string;
    online: boolean;
}

export interface LoginResponse {
    jsonrpc: string;
    id: string;
    session_id: string;
}
