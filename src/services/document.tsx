import { Params } from '@src/typings/common';
import {
    CreateDocumentResponse,
    DeleteDocumentLineResponse,
    GetDocumentByIdResponse,
    GetDocumentLineSearchResponse,
    GetDocumentSearchResponse,
    PostPutDocumentLineResponse,
    PutDocumentResponse
} from '@src/typings/document';
import { Response, post, postDelete, put } from '@src/utils/axios';

export function GetDocumentSearch(
    params: Params
): Promise<Response<GetDocumentSearchResponse>> {
    return post<GetDocumentSearchResponse>(`/api/document/search`, params);
}

export function GetDocumentLineSearch(
    params: Params
): Promise<Response<GetDocumentLineSearchResponse>> {
    return post<GetDocumentLineSearchResponse>(
        `/api/document/line/search`,
        params
    );
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
    return post<CreateDocumentResponse>(`/api/asset/tracking/create`, params);
}

export function AddDocumentLine(
    params: Params
): Promise<Response<PostPutDocumentLineResponse>> {
    return postDelete<PostPutDocumentLineResponse>(
        `/api/add/document/line`,
        params
    );
}

export function UpdateDocument(
    params: Params
): Promise<Response<PutDocumentResponse>> {
    return put<PutDocumentResponse>(`/api/asset/tracking/update`, params);
}

export function UpdateDocumentLine(
    params: Params
): Promise<Response<PostPutDocumentLineResponse>> {
    return put<PostPutDocumentLineResponse>(
        `/api/update/document/line`,
        params
    );
}
