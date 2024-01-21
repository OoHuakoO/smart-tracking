import axios, {
    AxiosError,
    AxiosRequestConfig,
    InternalAxiosRequestConfig
} from 'axios';

export const apiInstances = axios.create({
    baseURL: `http://27.254.207.59:10116`,
    responseType: 'json'
});

apiInstances.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (config.data instanceof FormData) {
            config.headers.set('Content-Type', 'multipart/form-data');
        } else {
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
    const convertData = { jsonrpc: '2.0', params: { ...data, db: 'ST1' } };
    const res = await apiInstances.post<Response<T>>(url, convertData, config);
    return res.data;
}
