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
    // for inner join
    location_name?: string;
    category_name?: string;
}

export interface GetAssetsData {
    total_page: number;
    current_page: number;
    asset: AssetData[];
    total: number;
    uid: number;
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
    id: number;
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

export interface CategoryData {
    category_id: number;
    category_name: string;
    category_code: string;
}

export interface GetCategoryData {
    uid: number;
    total_page: number;
    current_page: number;
    asset: CategoryData[];
    total: number;
}

export interface GetCategoryResponse {
    success: boolean;
    message: string;
    data: GetCategoryData;
}
