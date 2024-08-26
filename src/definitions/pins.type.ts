import { ProductFormData } from './product.type';

export interface Pin {
  pinPrefixFour: string;
  endDate: Date | string;
  pinCount: number;
  _id?: string;
  createdAt?: Date | string;
  product?: ProductFormData;
  number?: string;
}
