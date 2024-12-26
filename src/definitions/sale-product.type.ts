import { OrderPayType, OrderStatus } from './order.type';
import { SaleProductDB } from '@/app/api/models/sale-product.model';
import { Product } from '@/definitions';

export type UserInfo = {
  name: string;
  _id: string;
  companyName?: string;
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
  orderDate: Date | string;
  visitDate: Date | string;
  amount: number; // 구매
  quantity: number; //상품수량
  saleProduct: T; //판매 상품 아이디
  payType: OrderPayType;
}

export interface SaleProductBuyDisplayData<T>
  extends SaleProductBuyFormData<T> {
  _id: string;
  pins: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  status: OrderStatus;
  totalPrice: number;
  user: UserInfo;
  tickets: Tickets[];
  paymentId: string;
  merchantId: string;
  transName?: string;
  transNum?: string;
}
