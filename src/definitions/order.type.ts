import { OrderDB } from '@/app/api/models/order.model';

export enum OrderStatus {
  Unpaid = 'unpaid',
  Pending = 'pending',
  VbankReady = 'vbank_ready',
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
  merchantId?: string;
};

export type VBankResponse = {
  vbankName?: string;
  vbankCode?: string;
  vbankHolder?: string;
  vbankNum?: string;
  vbankDate?: string;
  amount?: number;
  buyerName?: string;
};
