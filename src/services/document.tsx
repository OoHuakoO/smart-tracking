import { GetParams } from '@src/typings/common';
import { GetDocumentSearchResponse } from '@src/typings/document';
import { Response, post } from '@src/utils/axios';

export function GetDocumentSearch(
    params: GetParams
): Promise<Response<GetDocumentSearchResponse>> {
    return post<GetDocumentSearchResponse>(`/api/document/search`, params);
}
