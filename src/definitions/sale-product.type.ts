import { SaleProductDB } from '@/app/api/models/sale-product.model';
import { Product } from '@/definitions';

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

export interface SaleProductBuyFormData<T> {
  // buyDate: Date | string;
  quantity: number; //상품수량
  saleProduct: T; //판매 상품 아이디
  buyType: string;
  _id?: string;
  pins?: string[];
  createdAt?: Date | string;
  orderDate?: Date | string;
  updatedAt?: Date | string;
  status?: string;
  totalPrice?: number;
  user?: { name: string; _id: string };

  //나중에 비회원 예약일때 사용
  // buyDate: Date | string;
  // buyHour: string;
  // buyMin: string;
  // buyProducts: T[];
  // buyName: string;
  // buyPhoneNumber: string;
  // buyEmail: string;
  // buyNumber: string;
  // consentCollection: boolean; //개인정보 수집 동의
  // consentProvision: boolean; //제 3자 제공동의
  // consentCancellation: boolean; //취소 환불
  // buyType: string;
}
