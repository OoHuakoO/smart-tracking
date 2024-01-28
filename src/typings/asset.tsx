export interface GetAssetsParams {
    page: number;
    limit: number;
}

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
    picture: string;
}

export interface GetAssetsData {
    uid: number;
    total_page: number;
    current_page: number;
    asset: AssetData[];
}

export interface GetAssetsResponse {
    success: boolean;
    message: string;
    data: GetAssetsData;
}
