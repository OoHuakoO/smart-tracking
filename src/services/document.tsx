import { GetParams } from '@src/typings/common';
import {
    DeleteDocumentLineResponse,
    GetDocumentByIdResponse,
    GetDocumentSearchResponse
} from '@src/typings/document';
import { Response, post, postDelete } from '@src/utils/axios';

export function GetDocumentSearch(
    params: GetParams
): Promise<Response<GetDocumentSearchResponse>> {
    return post<GetDocumentSearchResponse>(`/api/document/search`, params);
}

export function GetDocumentById(
    id: number
): Promise<Response<GetDocumentByIdResponse>> {
    return post<GetDocumentByIdResponse>(`/api/asset/tracking/${id}`);
}

export function DeleteDocumentLine(
    params: GetParams
): Promise<Response<DeleteDocumentLineResponse>> {
    return postDelete<DeleteDocumentLineResponse>(
        `/api/delete/document/line`,
        params
    );
}
