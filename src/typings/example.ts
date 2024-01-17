export interface Manufacturer {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Products {
  id: number;
  code: string;
  name: string;
  type: string;
  pathImage: string;
  amountS: number;
  amountM: number;
  amountL: number;
  amountXL: number;
  detail: string;
  size: string;
  sellPrice: number;
  cost: number;
  manufacturer: Manufacturer;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  code: string;
  name: string;
  type: string;
  amountS: number;
  amountM: number;
  amountL: number;
  amountXL: number;
  detail: string;
  size: string;
  sellPrice: number;
  cost: number;
  manufacturer: string;
}

export interface addStockRow {
  product_id: number;
  cost: number;
  sellPrice: number;
  name: string;
  amountS: number;
  amountM: number;
  amountL: number;
  amountXL: number;
}

export interface addStock {
  product_id: number;
  cost: number;
  sellPrice: number;
  amountS: number;
  amountM: number;
  amountL: number;
  amountXL: number;
}

export interface Stock {
  product_id: number;
  name: string;
  amount: number;
  cost: number;
  profit: number;
  category?: string;
  manufacturer?: string;
}

export interface ProductCreateParams {
  code: string;
  name: string;
  type: string;
  manufacturer: string;
  detail: string;
  size: string;
  sellPrice: number;
  cost: number;
}

export interface ProductEditParams {
  detail: string;
  sellPrice: number;
  cost: number;
}

export interface AddStockParams {
  product_id: number;
  cost: number;
  sellPrice: number;
  amountS: number;
  amountM: number;
  amountL: number;
  amountXL: number;
}

export interface SummaryParams {
  startDate?: string;
  endDate?: string;
}

export interface SummaryProfit {
  date: string;
  profit: number;
}

export interface ProductUpdateParams {
  detail?: string;
  type?: string;
  sellPrice?: number;
  cost?: number;
}

export interface ProductFormData {
  detail: string;
  type: string;
  sellPrice: number;
  cost: number;
}

export interface ProductSearchParams {
  name?: string;
  type?: string;
  manufacturer?: string;
  startPrice?: string;
  endPrice?: string;
}

export interface BuyProductParams {
  amount: number;
  size: string;
}
