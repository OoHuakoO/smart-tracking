import { envs } from '@src/constant';
import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';

export const apiInstances = axios.create({
    baseURL: `${envs.BASE_URL}/api`,
    responseType: 'json'
});

apiInstances.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        config.headers.set(
            'Authorization',
            `Bearer ${localStorage.getItem('act') || ''}`
        );
        if (config.data instanceof FormData) {
            config.headers.set('Content-Type', 'multipart/form-data');
        } else {
            config.headers.set(
                'Content-Type',
                'application/json;charset=UTF-8'
            );
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export interface Response<T = any> {
    id: null;
    jsonrpc?: number;
    result: T;
}

export async function download(
    url: string,
    config?: AxiosRequestConfig<any> | undefined
): Promise<AxiosResponse<any, any>> {
    const res = await apiInstances.get(url, config);
    return res;
}

export async function get<T = any>(
    url: string,
    config?: AxiosRequestConfig<any> | undefined
): Promise<Response<T>> {
    const res = await apiInstances.get<Response<T>>(url, config);
    return res.data;
}

export async function put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any> | undefined
): Promise<Response<T>> {
    const res = await apiInstances.put<Response<T>>(url, data, config);
    return res.data;
}

export async function post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any> | undefined
): Promise<Response<T>> {
    const res = await apiInstances.post<Response<T>>(url, data, config);
    return res.data;
}
