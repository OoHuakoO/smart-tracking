import { GetAssetByCodeResponse } from '@src/typings/asset';
import { Response, post } from '@src/utils/axios';

export function GetAssetByCode(
    code: string
): Promise<Response<GetAssetByCodeResponse>> {
    return post<GetAssetByCodeResponse>(`/api/asset/${code}`);
}
