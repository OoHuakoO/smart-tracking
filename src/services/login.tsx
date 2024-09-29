import { Params } from '@src/typings/common';
import {
    CheckActiveDeviceResponse,
    CheckMacAddressParams,
    CheckMacAddressResponse,
    GetAllUserOfflineResponse,
    LoginParams,
    LoginResponse,
    LogoutDeviceResponse
} from '@src/typings/login';
import { Response, post } from '@src/utils/axios';

// Online Mode

export function Login(params: LoginParams): Promise<Response<LoginResponse>> {
    return post<LoginResponse>('/api/user/login', params);
}

export function CheckActiveDevice(): Promise<
    Response<CheckActiveDeviceResponse>
> {
    return post<CheckActiveDeviceResponse>('/api/user/check');
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
