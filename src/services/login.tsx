import { Params } from '@src/typings/common';
import {
    CheckCompanyModeResponse,
    CheckMacAddressParams,
    CheckMacAddressResponse,
    CheckUserActiveResponse,
    GetAllUserOfflineResponse,
    LoginParams,
    LoginResponse,
    LogoutDeviceResponse
} from '@src/typings/login';
import { Response, post } from '@src/utils/axios';

export function CheckCompanyMode(): Promise<
    Response<CheckCompanyModeResponse>
> {
    return post<CheckCompanyModeResponse>('/api/check/company/mode');
}

// Online Mode

export function Login(params: LoginParams): Promise<Response<LoginResponse>> {
    return post<LoginResponse>('/api/user/login', params);
}

export function CheckUserActive(
    params: LoginParams
): Promise<Response<CheckUserActiveResponse>> {
    return post<CheckUserActiveResponse>('/api/user/check', params);
}

export function LogoutDevice(): Promise<Response<LogoutDeviceResponse>> {
    return post<LogoutDeviceResponse>('/api/user/logout');
}

// Offline Mode

export function CheckMacAddress(
    params: CheckMacAddressParams
): Promise<Response<CheckMacAddressResponse>> {
    return post<CheckMacAddressResponse>('/api/check/device', params);
}

export function GetAllUserOffline(
    params: Params
): Promise<Response<GetAllUserOfflineResponse>> {
    return post<GetAllUserOfflineResponse>('/api/all/user/register', params);
}
