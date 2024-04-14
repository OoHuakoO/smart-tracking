export interface LocationReportData {
    location_id: number;
    location_code: string;
    location_name: string;
    total_asset?: number;
}

export interface SearchQueryReport {
    location?: string;
    'location_id.id'?: number;
    'category_id.name'?: string;
    state?: string | string[];
    name?: string;
    use_state?: string;
}

export interface ReportAssetData {
    code: string;
    name: string;
    category: string;
    location_old?: string;
    location: string;
    use_state: string;
}
