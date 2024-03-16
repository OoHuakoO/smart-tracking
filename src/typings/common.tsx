interface assetID {
    id: number;
}
export interface GetParams {
    page?: number;
    limit?: number;
    search_term?: any;
    asset_tracking_id?: number;
    asset_ids?: assetID[];
}

export interface Toast {
    open: boolean;
    text: string;
}

export interface LoginState {
    session_id: string;
    uid: string;
}
