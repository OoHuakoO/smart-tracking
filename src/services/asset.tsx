import { GetAssetByCodeResponse } from '@src/typings/asset';
import { GetParams } from '@src/typings/common';
import { GetAssetsResponse } from '@src/typings/downloadDB';
import { Response, post } from '@src/utils/axios';

export function GetAssetByCode(
    code: string
): Promise<Response<GetAssetByCodeResponse>> {
    return post<GetAssetByCodeResponse>(`/api/asset/${code}`);
}

export function GetAssetSearch(
    params: GetParams
): Promise<Response<GetAssetsResponse>> {
    return post<GetAssetsResponse>(`/api/asset/search`, params);
}
