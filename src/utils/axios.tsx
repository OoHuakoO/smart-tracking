import AsyncStorage from '@react-native-async-storage/async-storage';
import { BranchStateProps } from '@src/typings/common';
import { SettingParams } from '@src/typings/login';
import axios, {
    AxiosError,
    AxiosRequestConfig,
    InternalAxiosRequestConfig
} from 'axios';

export const apiInstances = axios.create();

const getBaseURL = async () => {
    const settings = await AsyncStorage.getItem('Settings');
    const jsonSettings: SettingParams = JSON.parse(settings);
    return `https://${jsonSettings?.server || 'test01.odooerpthai.com'}`;
};

apiInstances.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (config.data instanceof FormData) {
            config.headers.set('Content-Type', 'multipart/form-data');
        } else {
            config.baseURL = await getBaseURL();
            config.responseType = 'json';
            config.headers.set(
                'content-type',
                'application/json;charset=UTF-8'
            );
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject(error);
    }
);

export interface ErrorDataResponse {
    name: string;
    debug: string;
    message: string;
    arguments: string[];
    context: any;
}

export interface ErrorResponse {
    code: number;
    message: string;
    data: ErrorDataResponse;
}

export interface Response<T = any> {
    id: string;
    jsonrpc?: number;
    result?: T;
    error?: ErrorResponse;
}

export async function get<T = any>(
    url: string,
    config?: AxiosRequestConfig<any> | undefined
): Promise<Response<T>> {
    const res = await apiInstances.get<Response<T>>(url, config);
    return res.data;
}

export async function post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any> | undefined
): Promise<Response<T>> {
    const settings = await AsyncStorage.getItem('Settings');
    const branch = await AsyncStorage.getItem('Branch');
    const jsonSettings: SettingParams = JSON.parse(settings);
    const jsonBranch: BranchStateProps = JSON.parse(branch);
    let login = data?.login ?? jsonSettings?.login;
    let password = data?.password ?? jsonSettings?.password;
    let mac_address = jsonSettings?.mac_address;
    let db = jsonSettings?.db;

    if (login === 'test' && password === '1234') {
        login = 'admin3';
        password = '1234';
        mac_address = '1234';
        db = 'DEMO';
        await AsyncStorage.setItem(
            'Settings',
            JSON.stringify({
                login: 'admin3',
                password: '1234',
                mac_address: '1234',
                server: 'test01.odooerpthai.com',
                db: 'DEMO'
            })
        );
    }

    const convertData = {
        jsonrpc: '2.0',
        params: {
            ...data,
            mac_address,
            db,
            login,
            password,
            branch_id: data?.branch_id === 0 ? null : jsonBranch?.branchId
        }
    };
    const res = await apiInstances.post<Response<T>>(url, convertData, config);
    return res.data;
}

export async function put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any> | undefined
): Promise<Response<T>> {
    const settings = await AsyncStorage.getItem('Settings');
    const jsonSettings: SettingParams = JSON.parse(settings);
    const convertData = {
        jsonrpc: '2.0',
        params: {
            ...data,
            db: jsonSettings?.db,
            login: data?.login ? data?.login : jsonSettings?.login,
            password: data?.password ? data?.password : jsonSettings?.password
        }
    };
    const res = await apiInstances.put<Response<T>>(url, convertData, config);
    return res.data;
}

export async function postDelete<T = any>(
    url: string,
    data?: any
): Promise<Response<T>> {
    const settings = await AsyncStorage.getItem('Settings');
    const jsonSettings: SettingParams = JSON.parse(settings);
    const convertData = {
        jsonrpc: '2.0',
        params: {
            ...data,
            db: jsonSettings?.db,
            login: data?.login ? data?.login : jsonSettings?.login,
            password: data?.password ? data?.password : jsonSettings?.password
        }
    };
    const res = await apiInstances.delete<Response<T>>(url, {
        data: convertData
    });
    return res.data;
}
