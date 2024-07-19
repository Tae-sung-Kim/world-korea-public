import { Product } from '@/app/api/models/product.model';
import { PRODUCT_STATUS } from '@/constants';

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export interface IProduct extends Product {
  _id: string;
}
