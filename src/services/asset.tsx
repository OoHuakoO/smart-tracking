import { GetAssetsParams, GetAssetsResponse } from '@src/typings/asset';
import { Response, post } from '@src/utils/axios';

export function GetAssets(
    params: GetAssetsParams
): Promise<Response<GetAssetsResponse>> {
    return post<GetAssetsResponse>('/api/all/assets', params);
}
