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
    total_page: number;
    current_page: number;
    asset: AssetData[];
    total: number;
}

export interface GetAssetsResponse {
    success: boolean;
    message: string;
    data: GetAssetsData;
}

export interface LocationData {
    asset_location_id: number;
    name: string;
}

export interface GetLocationData {
    total_page: number;
    current_page: number;
    data: LocationData[];
    total: number;
}

export interface GetLocationResponse {
    success: boolean;
    message: string;
    data: GetLocationData;
}

export interface UseStatusData {
    name: string;
}

export interface GetUseStatusData {
    total_page: number;
    current_page: number;
    data: UseStatusData[];
    total: number;
}

export interface GetUseStatusResponse {
    success: boolean;
    message: string;
    data: GetUseStatusData;
}
