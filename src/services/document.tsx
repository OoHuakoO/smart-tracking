import { Params } from '@src/typings/common';
import {
    CreateDocumentResponse,
    DeleteDocumentLineResponse,
    GetDocumentByIdResponse,
    GetDocumentSearchResponse,
    PostPutDocumentLineResponse
} from '@src/typings/document';
import { Response, post, postDelete, put } from '@src/utils/axios';

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
): Promise<Response<PostPutDocumentLineResponse>> {
    return postDelete<PostPutDocumentLineResponse>(
        `/api/add/document/line`,
        params
    );
}

export function UpdateDocumentLine(
    params: Params
): Promise<Response<PostPutDocumentLineResponse>> {
    console.log(params);
    return put<PostPutDocumentLineResponse>(
        `/api/update/document/line`,
        params
    );
}
