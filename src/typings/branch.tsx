export interface GetBranchData {
    branch_id: number;
    branch_code: string;
    branch_name: string;
    total_assets: number;
}

export interface GetBranchResponse {
    success: boolean;
    message: string;
    data: GetBranchData;
}
