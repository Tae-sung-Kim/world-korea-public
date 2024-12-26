import { OrderDB } from '@/app/api/models/order.model';

export enum OrderStatus {
  Unpaid = 'unpaid',
  Pending = 'pending',
  Completed = 'completed',
  Canceled = 'canceled',
  Refunded = 'refunded',
}

export enum OrderPayType {
  Card = 'card',
  Trans = 'trans',
}

export type Order = OrderDB & {
  _id: string;
};

export enum PaymentStatus {
  Success = 'success',
  Fail = 'fail',
  Error = 'error',
  Ready = 'ready',
  Processing = 'processing',
  Refunded = 'refunded',
  Failed = 'failed',
}

export type PaymentRequest = {
  orderId?: string;
  paymentId?: string | null | undefined;
  amount?: number;
  merchantId?: string;
  payType?: string;
};

export type TransResponse = {
  transName?: string; // 은행명
  transHolder?: string; // 예금주
  transNum?: string; // 계좌 번호
  amount?: number; // 입금금액
  buyerName?: string; // 구매자
};
