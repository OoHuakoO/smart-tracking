import { Params } from '@src/typings/common';
import {
    AddDocumentLineResponse,
    CreateDocumentResponse,
    DeleteDocumentLineResponse,
    GetDocumentByIdResponse,
    GetDocumentSearchResponse
} from '@src/typings/document';
import { Response, post, postDelete } from '@src/utils/axios';

export function GetDocumentSearch(
    params: Params
): Promise<Response<GetDocumentSearchResponse>> {
    return post<GetDocumentSearchResponse>(`/api/document/search`, params);
}

export function GetDocumentById(
    id: number
): Promise<Response<GetDocumentByIdResponse>> {
    return post<GetDocumentByIdResponse>(`/api/asset/tracking/${id}`);
}

export function DeleteDocumentLine(
    params: Params
): Promise<Response<DeleteDocumentLineResponse>> {
    return postDelete<DeleteDocumentLineResponse>(
        `/api/delete/document/line`,
        params
    );
}

export function CreateDocument(
    params: Params
): Promise<Response<CreateDocumentResponse>> {
    return post<CreateDocumentResponse>(
        `/api/document/tracking/create/`,
        params
    );
}

export function AddDocumentLine(
    params: Params
): Promise<Response<AddDocumentLineResponse>> {
    return postDelete<AddDocumentLineResponse>(
        `/api/add/document/line`,
        params
    );
}
