import {
    CreateAssetResponse,
    GetAssetByCodeResponse
} from '@src/typings/asset';
import { Params } from '@src/typings/common';
import { GetAssetsResponse } from '@src/typings/downloadDB';
import { Response, post } from '@src/utils/axios';

export function GetAssetByCode(
    code: string
): Promise<Response<GetAssetByCodeResponse>> {
    return post<GetAssetByCodeResponse>(`/api/asset/${code}`);
}

export function GetAssetSearch(
    params: Params
): Promise<Response<GetAssetsResponse>> {
    return post<GetAssetsResponse>(`/api/asset/search`, params);
}

export function CreateAsset(
    params: Params
): Promise<Response<CreateAssetResponse>> {
    return post<CreateAssetResponse>(`/api/asset/create`, params);
}
