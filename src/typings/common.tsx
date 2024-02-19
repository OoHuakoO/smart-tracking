export interface GetParams {
    page: number;
    limit: number;
    search_term?: any;
}

export interface Toast {
    open: boolean;
    text: string;
}
