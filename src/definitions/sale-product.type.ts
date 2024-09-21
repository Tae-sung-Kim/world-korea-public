import { Pin } from './pins.type';
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

//일단 생각나는 대로 작성
export interface SaleProductBuyFormData<T> {
  buyDate: Date | string;
  buyHour: string;
  buyMin: string;
  buyProducts: T[];
  buyName: string;
  buyPhoneNumber: string;
  buyEmail: string;
  buyNumber: string;
  consentCollection: boolean; //개인정보 수집 동의
  consentProvision: boolean; //제 3자 제공동의
  consentCancellation: boolean; //취소 환불
  buyType: string;
}
