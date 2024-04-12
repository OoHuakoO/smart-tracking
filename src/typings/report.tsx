export interface LocationReportData {
    location_id: number;
    location_code: string;
    location_name: string;
    total_asset: number;
}

export interface SearchQueryReport {
    'location_id.id'?: number;
    state?: string | string[];
}

export interface ReportAssetData {
    code: string;
    name: string;
    category: string;
    location_old?: string;
    location: string;
    use_state: string;
}
