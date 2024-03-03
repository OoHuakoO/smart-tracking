export interface AssetData {
    asset_id: number;
    default_code: string;
    name: string;
    description: string;
    category_id: number;
    serial_no: string;
    brand_name: string;
    quantity: number;
    location_id: number;
    image: string;
    use_state: string;
    owner: string;
    new_img: boolean;
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
