export interface SettingParams {
    server: string;
    login: string;
    password: string;
    db: string;
    online: boolean;
    mac_address: string;
}

// Online Mode

export interface LoginParams {
    login: string;
    password: string;
    mac_address?: string;
}

export interface LoginData {
    user_id: string;
}
export interface LoginResponse {
    data: LoginData;
    message: string;
    success: boolean;
}

export interface CheckUserActiveData {
    is_login: boolean;
    mac_address: string;
}

export interface CheckUserActiveResponse {
    data: CheckUserActiveData;
}

export interface LogoutDeviceResponse {
    success: boolean;
}

// Offline Mode

export interface CheckMacAddressData {
    mac_address: string;
    device_active: boolean;
}

export interface CheckMacAddressParams {
    login?: string;
    password?: string;
    mac_address: string;
}

export interface CheckMacAddressResponse {
    success: boolean;
    data: CheckMacAddressData;
}

export interface UserList {
    user_name: string;
    user_id: string;
    email: string;
}

export interface UserResponse {
    user: UserList[];
    total_page: number;
    current_page: number;
    total: number;
}

export interface GetAllUserOfflineResponse {
    data: UserResponse;
}

export interface CheckCompanyModeData {
    mode: string;
}
export interface CheckCompanyModeResponse {
    success: boolean;
    data: CheckCompanyModeData;
    message: string;
}
