export interface LoginParams {
    login: string;
    password: string;
}

export interface LoginResponse {
    jsonrpc: string;
    id: string;
    session_id: string;
}
