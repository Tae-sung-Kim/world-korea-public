import { ProductFormData } from './product.type';

export type PinData = {
  pinNumber: string;
  endDate: Date;
};

export interface Pin {
  endDate?: Date | string;
  pinCount?: number;
  pinList?: PinData[];
  pinPrefixFour?: string;
  _id?: string;
  createdAt?: Date | string;
  product?: ProductFormData<string>;
  productId?: string;
  number?: string;
  usedDate?: Date | string;
}

export type SearchParams = Record<string, number | string | undefined>;

export type PinUsed = {
  pinNumberList: string[];
};
