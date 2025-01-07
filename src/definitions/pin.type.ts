import { OrderStatus, User } from '.';
import { ProductDisplayData } from './product.type';

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
  product?: ProductDisplayData;
  partner?: Partial<User>;
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
