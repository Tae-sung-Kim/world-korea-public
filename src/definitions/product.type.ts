import { Pin } from './pin.type';
import { ProductDB } from '@/app/api/models/product.model';
import { PRODUCT_STATUS } from '@/definitions';

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export type Product = {
  _id: string;
  name: string; // 상품명
  accessLevel: number; // 접근 레벨
  status: ProductStatus; // 상품 상태
  images: string[]; // 상품 이미지
  regularPrice: number; // 정가
  salePrice: number; // 할인가
  price: number; // 판매가
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  unavailableDates?: Date[]; // 이용 불가능 날짜
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  pinCount?: number;
  pins: Pin[];
};

export type ProductImage = {
  file?: File;
};

export interface ProductFormData<T> {
  name: string; // 상품명
  accessLevel: string; // 접근 레벨
  status: ProductStatus; // 상품 상태
  images: T[];
  regularPrice: string; // 정가
  salePrice: string; // 할인가
  price: string; // 판매가
  taxFree: string; // 면세가
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  unavailableDates?: string[];
  isLotteWorld?: boolean;
}

export interface ProductDisplayData extends ProductFormData<string> {
  _id: string;
  createdAt: string;
  updatedAt: string;
  pins: Pin[];
  pinCount: number;
  partner?: string;
}
