import { AssetData } from './downloadDB';

export interface AssetDataForPassParamsDocumentCreate {
    default_code: string;
    name: string;
    state: string;
    use_state: string;
    location: string;
    image?: string | boolean;
    new_img?: boolean;
    category_id?: number;
    category?: string;
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
    default_code?: string;
    name?: string;
    'location_id.name'?: string;
    use_state?: string;
    'category_id.name'?: string;
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
