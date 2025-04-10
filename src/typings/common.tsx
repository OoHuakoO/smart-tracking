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
    android_id?: string;
    branch_id?: number;
    user_id?: string;
}

export interface Toast {
    open: boolean;
    text: string;
}

export interface LoginState {
    uid?: string;
}

export interface DocumentState {
    id: number;
    name?: string;
    state: string;
    location: string;
    location_id: number;
}

export interface BranchStateProps {
    branchId?: number;
    branchName?: string;
}
