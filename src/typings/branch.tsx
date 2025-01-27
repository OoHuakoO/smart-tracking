export interface GetBranchData {
    branch_id: number;
    branch_code: string;
    branch_name: string;
    total_assets: number;
    total_location: number;
}

export interface GetBranchSelectData {
    total_page: number;
    current_page: number;
    assets: GetBranchData[];
    total: number;
    uid: number;
}

export interface GetBranchResponse {
    success: boolean;
    message: string;
    data: GetBranchData[];
}
