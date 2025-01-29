import {
    GetBranchResponse,
    GetBranchSearchResponse
} from '@src/typings/branch';
import { Params } from '@src/typings/common';
import { Response, post } from '@src/utils/axios';

export function GetBranches(
    params: Params
): Promise<Response<GetBranchResponse>> {
    return post<GetBranchResponse>('/api/all/branch', params);
}

export function GetBranchSearch(
    params: Params
): Promise<Response<GetBranchSearchResponse>> {
    return post<GetBranchSearchResponse>('/api/branch/search', params);
}
