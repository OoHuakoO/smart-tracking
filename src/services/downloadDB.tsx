import { GetParams } from '@src/typings/common';
import {
    GetAssetsResponse,
    GetCategoryResponse,
    GetLocationResponse,
    GetUseStatusResponse
} from '@src/typings/downloadDB';
import { Response, post } from '@src/utils/axios';

export function GetAssets(
    params: GetParams
): Promise<Response<GetAssetsResponse>> {
    return post<GetAssetsResponse>('/api/all/assets', params);
}

export function GetUseStatus(
    params: GetParams
): Promise<Response<GetUseStatusResponse>> {
    return post<GetUseStatusResponse>('/api/all/use/state', params);
}

export function GetLocation(
    params: GetParams
): Promise<Response<GetLocationResponse>> {
    return post<GetLocationResponse>('/api/all/locations', params);
}

export function GetCategory(
    params: GetParams
): Promise<Response<GetCategoryResponse>> {
    return post<GetCategoryResponse>('/api/all/categorys', params);
}
