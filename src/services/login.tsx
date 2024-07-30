import {
    ActiveDeviceParams,
    ActiveDeviceResponse,
    CheckActiveDeviceParams,
    CheckActiveDeviceResponse,
    CheckMacAddressParams,
    CheckMacAddressResponse,
    CreateDeviceParams,
    CreateDeviceResponse,
    LoginParams,
    LoginResponse,
    LogoutDeviceParams,
    LogoutDeviceResponse
} from '@src/typings/login';
import { Response, post } from '@src/utils/axios';

export function Login(params: LoginParams): Promise<Response<LoginResponse>> {
    return post<LoginResponse>('/web/session/authenticate', params);
}

// Online Mode

export function CreateDevice(
    params: CreateDeviceParams
): Promise<Response<CreateDeviceResponse>> {
    return post<CreateDeviceResponse>('/api/device/create', params);
}

export function ActiveDevice(
    params: ActiveDeviceParams
): Promise<Response<ActiveDeviceResponse>> {
    return post<ActiveDeviceResponse>('/api/device/active', params);
}

export function CheckActiveDevice(
    params: CheckActiveDeviceParams
): Promise<Response<CheckActiveDeviceResponse>> {
    return post<CheckActiveDeviceResponse>('/api/device/user/check', params);
}

export function LogoutDevice(
    params: LogoutDeviceParams
): Promise<Response<LogoutDeviceResponse>> {
    return post<LogoutDeviceResponse>('/api/device/logout', params);
}

// Offline Mode

export function CheckMacAddress(
    params: CheckMacAddressParams
): Promise<Response<CheckMacAddressResponse>> {
    return post<CheckMacAddressResponse>('/api/get/device/mac/address', params);
}
