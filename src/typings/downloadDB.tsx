export interface AssetData {
    asset_id: number;
    default_code: string;
    name: string;
    description: string;
    category_id: number;
    category: string;
    serial_no: string;
    brand_name: string;
    quantity: number;
    location_id: number;
    location: string;
    image: string;
    state?: string;
    use_state: string;
    owner: string;
    new_img: boolean;
    purchase_price: number;
    is_sync_odoo?: boolean;
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
    location_id: number;
    location_code: string;
    location_name: string;
}

export interface GetLocationData {
    total_page: number;
    current_page: number;
    asset: LocationData[];
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

export interface ReportAssetData {
    code: string;
    name: string;
    category: string;
    serial_no: string;
    location_old?: string;
    location: string;
    quantity: number;
    state: string;
    use_state: string;
    new_img: boolean;
    image: string;
}

export interface ReportData {
    id: number;
    state: string;
    date_order: string;
    owner: string;
    owner_id: number;
    assets: ReportAssetData[];
}

export interface GetReportData {
    total_page: number;
    current_page: number;
    asset: ReportData[];
    total: number;
    uid: number;
}

export interface GetReportResponse {
    success: boolean;
    message: string;
    data: GetReportData;
}
