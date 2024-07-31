import { ProductDB } from '@/app/api/models/product.model';
import { PRODUCT_STATUS } from '@/definitions';

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export interface IProduct extends ProductDB {
  _id: string;
}
