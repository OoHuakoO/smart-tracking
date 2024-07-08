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

export interface CreateDeviceParams {
    login: string;
    password: string;
    mac_address: string;
    device_name: string;
}

export interface CreateDeviceResponse {
    device_name: string;
    mac_address: string;
    user_name: string;
    user_active: boolean;
}

export interface ActiveDeviceParams {
    login: string;
    password: string;
    mac_address: string;
    device_name: string;
}

export interface ActiveDeviceResponse {
    device_name: string;
    mac_address: string;
    user_name: string;
    user_active: boolean;
    device_offline_mode: boolean;
}

export interface CheckDeviceParams {
    login: string;
    password: string;
    mac_address: string;
    device_name: string;
}

export interface LogoutDeviceParams {
    login: string;
    password: string;
    mac_address: string;
    device_name: string;
}

export interface LogoutDeviceResponse {
    device_name: string;
    mac_address: string;
    user_name: string;
    user_active: boolean;
    device_offline_mode: boolean;
}
