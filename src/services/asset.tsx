import {
    GetAssetsResponse,
    GetLocationResponse,
    GetUseStatusResponse
} from '@src/typings/asset';
import { GetParams } from '@src/typings/common';
import { Response, post } from '@src/utils/axios';

export function GetAssets(
    params: GetParams
): Promise<Response<GetAssetsResponse>> {
    return post<GetAssetsResponse>('/api/all/assets', params);
}

export function GetUseStatus(
    params: GetParams
): Promise<Response<GetUseStatusResponse>> {
    return post<GetUseStatusResponse>('/api/all/status', params);
}

export function GetLocation(
    params: GetParams
): Promise<Response<GetLocationResponse>> {
    return post<GetLocationResponse>('/api/all/locations', params);
}
