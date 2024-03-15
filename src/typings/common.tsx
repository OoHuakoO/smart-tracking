export interface GetParams {
    page: number;
    limit: number;
    search_term?: any;
}

export interface Toast {
    open: boolean;
    text: string;
}

export interface LoginState {
    session_id: string;
    uid: string;
}
