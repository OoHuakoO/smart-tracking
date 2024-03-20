import { AssetData } from './downloadDB';

export interface AssetDataForPassParamsDocumentCreate {
    asset_id: number;
    default_code: string;
    name: string;
    state: string;
    use_state: string;
    image?: string | boolean;
    new_img?: boolean;
}

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

export interface CreateAssetData {
    id: number;
    asset: AssetData;
}
export interface CreateAssetResponse {
    success: boolean;
    message: string;
    data: CreateAssetData;
}
