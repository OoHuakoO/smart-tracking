export interface Params {
    page?: number;
    limit?: number;
    search_term?: any;
    location_id?: number;
    asset_tracking_id?: number;
    asset_ids?: any[];
}

export interface Toast {
    open: boolean;
    text: string;
}

export interface LoginState {
    session_id: string;
    uid: string;
}
