import { AssetData } from './downloadDB';

export interface GetAssetData {
    total_page: number;
    current_page: number;
    asset: AssetData;
    total: number;
    uid: number;
}

export interface GetAssetByCodeResponse {
    success: boolean;
    message: string;
    data: GetAssetData;
}

export interface SearchAsset {
    default_code: string;
    name: string;
    location: string;
    use_state: string;
    category_id: number;
}
