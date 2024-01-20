import { Response, get, post } from '@src/utils/axios';
import {
    AddStockParams,
    BuyProductParams,
    ProductSearchParams,
    Products,
    SummaryParams,
    SummaryProfit
} from '../typings/example';

export function getProducts(
    params: ProductSearchParams
): Promise<Response<Products[]>> {
    return get<Products[]>('/products', { params });
}

export function getDetailProducts(id: number): Promise<Response<Products>> {
    return get<Products>(`/product/${id}`);
}

export function getDetailCustomer(id: number): Promise<Response<Products>> {
    return get<Products>(`/product/${id}`);
}

export function editProduct(
    id: number,
    params: FormData
): Promise<Response<string>> {
    return post<string>(`/product/${id}`, params);
}

export function getProfitSummary(
    params: SummaryParams
): Promise<Response<SummaryProfit[]>> {
    return get<SummaryProfit[]>('/profit-summary', { params });
}

export function createProduct(params: FormData): Promise<Response<string>> {
    return post<string>('/product', params);
}

export function addStockProduct(
    params: AddStockParams[]
): Promise<Response<string>> {
    return post<string>('/product-order', params);
}

export function buyProduct(
    id: number,
    params: BuyProductParams
): Promise<Response<string>> {
    return post<string>(`/customer-order/${id}`, params);
}
