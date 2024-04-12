export interface LocationSearchData {
    location_id: number;
    location_name: string;
    location_code: string;
}

export interface GetLocationSearchData {
    total_page: number;
    current_page: number;
    locations: LocationSearchData[];
    total: number;
    uid: number;
}

export interface GetLocationSearchResponse {
    success: boolean;
    message: string;
    data: GetLocationSearchData;
}
