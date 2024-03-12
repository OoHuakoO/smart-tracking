export interface DocumentAssetData {
    code: string;
    name: string;
    category: number;
    serial_no: string;
    location_old: string;
    location: string;
    quantity: number;
    state: string;
    use_state: string;
    new_img: boolean;
    image: string;
}

export interface DocumentData {
    id: string;
    location_id: number;
    location: string;
    state: string;
    date_order: string;
    owner: string;
    owner_id: number;
    assets: DocumentAssetData[];
}

export interface GetDocumentSearchData {
    total_page: number;
    current_page: number;
    documents: DocumentData[];
    total: number;
    uid: number;
}

export interface GetDocumentSearchResponse {
    success: boolean;
    message: string;
    data: GetDocumentSearchData;
}
