import { Params } from '@src/typings/common';
import { GetLocationSearchResponse } from '@src/typings/location';
import { Response, post } from '@src/utils/axios';

export function GetLocationSearch(
    params: Params
): Promise<Response<GetLocationSearchResponse>> {
    return post<GetLocationSearchResponse>(`/api/location/search`, params);
}
