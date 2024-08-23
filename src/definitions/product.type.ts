import { Pin } from './pins.type';
import { ProductDB } from '@/app/api/models/product.model';
import { PRODUCT_STATUS } from '@/definitions';

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export type Product = ProductDB & {
  _id: string;
  pinCount: number;
  pins: Pin[];
};

export type ProductImage = {
  file?: File;
};

export interface ProductFormData {
  name: string; // 상품명
  accessLevel: string; // 접근 레벨
  status: ProductStatus; // 상품 상태
  images: ProductImage[] | string[]; // 상품 이미지
  // images: File[] | string[]; // 상품 이미지
  regularPrice: string; // 정가
  salePrice: string; // 할인가
  price: string; // 판매가
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  // unavailableDates?: Date[]; // 이용 불가능 날짜
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  pins?: Pin[];
  unavailableDates?: string[];
}
