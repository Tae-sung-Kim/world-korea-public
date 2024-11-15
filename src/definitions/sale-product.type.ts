import { SaleProductDB } from '@/app/api/models/sale-product.model';
import { Product } from '@/definitions';

export type NameAndId = {
  name: string;
  _id: string;
};

export type SaleProduct = SaleProductDB & {
  _id: string;
  products: Product[];
};

export type PackageDetailName = {
  _id: string;
  name: string;
  images: string[];
  pinCount: number;
};

export interface SaleProductFormData<T> {
  _id?: string;
  name: string; // 상품명
  price: string; // 판매가
  products: T[];
  accessLevel: string;
  isReservable: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type Tickets = {
  shortId: string;
  pins: string[];
  _id: string;
};

export interface SaleProductBuyFormData<T> {
  quantity: number; //상품수량
  saleProduct: T; //판매 상품 아이디
  buyType: string;
}

export interface SaleProductBuyDisplayData<T>
  extends SaleProductBuyFormData<T> {
  _id: string;
  pins: string[];
  createdAt: Date | string;
  orderDate: Date | string;
  updatedAt: Date | string;
  status: string;
  totalPrice: number;
  user: NameAndId;
  tickets: Tickets[];
}
