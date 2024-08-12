export interface LoginParams {
    login: string;
    password: string;
}

export interface SettingParams {
    server: string;
    login: string;
    password: string;
    db: string;
    online: boolean;
}

export interface LoginResponse {
    uid: string;
    session_id: string;
}

// Online Mode

export interface DataResponse {
    device_name: string;
    mac_address: string;
    user_name: string;
    user_active: boolean;
    device_offline_mode: boolean;
}

export interface CreateDeviceParams {
    login?: string;
    password?: string;
    mac_address: string;
    device_name?: string;
}

export interface CreateDeviceResponse {
    data: DataResponse;
}

export interface ActiveDeviceParams {
    login?: string;
    password?: string;
    mac_address: string;
    device_name?: string;
}

export interface ActiveDeviceResponse {
    data: DataResponse;
}

export interface CheckActiveDeviceParams {
    login?: string;
    password?: string;
    mac_address?: string;
    device_name?: string;
}

export interface CheckActiveDeviceResponse {
    data: DataResponse;
}

export interface LogoutDeviceParams {
    login?: string;
    password?: string;
    mac_address: string;
    device_name?: string;
}

export interface LogoutDeviceResponse {
    data: DataResponse;
}

// Offline Mode

export interface CheckMacAddressParams {
    login?: string;
    password?: string;
    mac_address: string;
    device_name?: string;
}

export interface CheckMacAddressResponse {
    data: DataResponse;
}

export interface UserList {
    user_name: string;
    user_id: string;
    user_offline_mode: string;
}

export interface UserResponse {
    user: UserList[];
}

export interface GetAllUserOfflineResponse {
    data: UserResponse;
}
