import { OrderDB } from '@/app/api/models/order.model';

export enum OrderStatus {
  Unpaid = 'unpaid',
  Pending = 'pending',
  Completed = 'completed',
  Canceled = 'canceled',
}

export type Order = OrderDB & {
  _id: string;
};

export enum PaymentStatus {
  Success = 'success',
  Fail = 'fail',
  Error = 'error',
  Ready = 'ready',
}

export type PaymentRequest = {
  orderId: string;
  paymentId: string | null | undefined;
};
