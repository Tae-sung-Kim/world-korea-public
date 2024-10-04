import { OrderStatus } from '.';
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
  orderStatus?: OrderStatus;
  product?: ProductFormData<string>;
  productId?: string;
  number?: string;
  usedDate?: Date | string;
}

export type SearchParams = Record<string, number | string | undefined>;

export type PinUsed = {
  pinNumberList: string[];
};

export enum PinStatus {
  Unused = 'unused',
  Pending = 'pending',
  Used = 'used',
}
