export interface Params {
    page?: number;
    limit?: number;
    search_term?: any;
    location_id?: number;
    asset_tracking_id?: number;
    asset_ids?: any[];
    asset_data?: any;
    date_order?: string;
    date_check?: string;
    document_data?: any;
}

export interface Toast {
    open: boolean;
    text: string;
}

export interface LoginState {
    session_id: string;
    uid: string;
}

export interface DocumentState {
    id: number;
    name?: string;
    state: string;
    location: string;
    location_id: number;
}
