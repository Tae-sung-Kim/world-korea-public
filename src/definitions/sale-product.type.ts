import { SaleProductDB } from '@/app/api/models/sale-product.model';
import { Product } from '@/definitions';

export type SaleProduct = SaleProductDB & {
  _id: string;
  products: Product[];
};

export type PackageDetailName = {
  _id: string;
  name: string;
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
