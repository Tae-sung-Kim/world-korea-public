import { SaleProductDB } from '@/app/api/models/sale-product.model';
import { Product } from '@/definitions';

export type SaleProduct = SaleProductDB & {
  _id: string;
  products: Product[];
};

export interface SaleProductFormData {
  _id?: string;
  name: string; // 상품명
  price: string; // 판매가
  products?: Product[];
  accessLevel: string;
}
