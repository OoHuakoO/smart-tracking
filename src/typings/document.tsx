export interface DocumentAssetData {
    asset_id: number;
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
    date_check: string;
}

export interface DocumentData {
    id: number;
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

export interface GetDocumentByIdData {
    asset: DocumentData;
    uid: number;
}

export interface GetDocumentByIdResponse {
    success: boolean;
    message: string;
    data: GetDocumentByIdData;
}

export interface DeleteDocumentLineResponse {
    success: boolean;
    message: string;
}

export interface SampleDateCreateDocument {
    location_id: number;
    date_order: string;
    user_id: number;
}
export interface CreateDocumentResponse {
    success: boolean;
    message: string;
    asset_tracking_id: number;
    sample_data: SampleDateCreateDocument;
}

export interface AddDocumentLineResponse {
    success: boolean;
    message: string;
    error: string;
}

export interface State {
    label: string;
    value: string;
}

export interface SearchDocument {
    location: string;
    state: string;
    start_date: string;
    end_date: string;
}
