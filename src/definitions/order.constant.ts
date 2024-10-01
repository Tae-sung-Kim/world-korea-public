import { OrderStatus } from './order.type';

// 구매 상태에 따른 메시지 정의
export const ORDER_STATUS_MESSAGE: Record<OrderStatus, string> = {
  [OrderStatus.Unpaid]: '미결제',
  [OrderStatus.Pending]: '결제 중',
  [OrderStatus.Completed]: '완료',
  [OrderStatus.Canceled]: '취소',
};
