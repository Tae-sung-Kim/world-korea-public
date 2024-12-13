import { OrderPayType, OrderStatus } from './order.type';

// 구매 상태에 따른 메시지 정의
export const ORDER_STATUS_MESSAGE: Record<OrderStatus, string> = {
  [OrderStatus.Unpaid]: '미결제',
  [OrderStatus.Pending]: '결제 중',
  [OrderStatus.Completed]: '완료',
  [OrderStatus.Canceled]: '취소',
  [OrderStatus.Refunded]: '결제 취소',
  [OrderStatus.VbankReady]: '가상계좌 주문',
};

export const ORDER_PAY_TYPE_MESSAGE: Record<OrderPayType, string> = {
  [OrderPayType.Card]: '신용카드',
  [OrderPayType.Vbank]: '가상계좌(무통장입금)',
};
