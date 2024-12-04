import { OrderDB } from '@/app/api/models/order.model';

export enum OrderStatus {
  Unpaid = 'unpaid',
  Pending = 'pending',
  Completed = 'completed',
  Canceled = 'canceled',
  Refunded = 'refunded',
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
};
