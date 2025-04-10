export interface GetBranchData {
    branch_id: number;
    branch_code: string;
    branch_name: string;
    total_assets: number;
    total_locations: number;
}

export interface GetBranchSelectData {
    total_page: number;
    current_page: number;
    assets: GetBranchData[];
    total: number;
    uid: number;
}

export interface GetBranchSearchSelectData {
    total_page: number;
    current_page: number;
    assets: GetBranchData[];
    total: number;
    uid: number;
}

export interface GetBranchResponse {
    success: boolean;
    message: string;
    data: GetBranchSelectData;
}

export interface GetBranchSearchResponse {
    success: boolean;
    message: string;
    data: GetBranchSearchSelectData;
}
