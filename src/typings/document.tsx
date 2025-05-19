export interface DocumentAssetData {
    id?: number;
    tracking_id?: number;
    asset_id?: number;
    code?: string;
    name?: string;
    category?: string;
    category_id?: number;
    serial_no?: string;
    location_id?: number;
    location_old?: string;
    location?: string;
    state?: string;
    use_state?: string | number;
    new_img?: boolean;
    image?: string;
    mode?: string;
    date_check?: string;
    branch_id?: number;
    is_cancel?: boolean;
    asset_id_update?: number;
    use_state_code?: number;
    is_sync_odoo?: boolean;
}

export interface DocumentData {
    id: number;
    tracking_id?: number;
    name?: string;
    location_id?: number;
    location?: string;
    state: string;
    date_order?: string;
    owner?: string;
    owner_id?: number;
    assets?: DocumentAssetData[];
    is_sync_odoo?: boolean;
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

export interface DocumentLineData {
    assets: DocumentAssetData[];
}

export interface GetDocumentLineSearchData {
    total_page: number;
    current_page: number;
    document_item_line: DocumentLineData[];
    total: number;
    uid: number;
}

export interface GetDocumentLineSearchResponse {
    success: boolean;
    message: string;
    data: GetDocumentLineSearchData;
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

export interface CreateDocumentDataResponse {
    id: number;
    state: string;
    date_order: string;
    location_id: number;
    location: string;
}
export interface CreateDocumentResponse {
    success: boolean;
    message: string;
    data: CreateDocumentDataResponse;
}

export interface PostPutDocumentLineResponse {
    success: boolean;
    message: string;
    error: string;
}

export interface PutDocumentResponse {
    success: boolean;
    message: string;
    error: string;
}

export interface State {
    label: string;
    value: string;
}

export interface SearchDocument {
    'location_id.name': string;
    state: string;
}
