import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import {
  UserInfo,
  PaginationResponse,
  PaymentRequest,
  SaleProductBuyDisplayData,
  SaleProductBuyFormData,
} from '@/definitions';
import http from '@/services';
import qs from 'qs';

class OrdersService {
  // 상품 구매
  createOrder(data: SaleProductBuyFormData<string>) {
    return http.post<SaleProductBuyDisplayData<string>>('/api/orders', data);
  }

  // 구매 목록
  getOrderList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<SaleProductBuyDisplayData<UserInfo>>>(
      `/api/orders?${params}`
    );
  }

  // 결제
  createPayment({ orderId, paymentId }: PaymentRequest) {
    return http.post<string>(`/api/orders/${orderId}/confirm-payment`, {
      paymentId,
    });
  }

  // 환불
  createRefund({ orderId, paymentId, payType }: PaymentRequest) {
    return http.post<string>(`/api/orders/${orderId}/refund`, {
      paymentId,
      payType,
    });
  }

  // 결제 취소
  patchCancel({ orderId }: PaymentRequest) {
    return http.patch<string>(`/api/orders/${orderId}/cancel`);
  }

  // 회원 구매 목록

  getUserOrderList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});
    return http.get<PaginationResponse<SaleProductBuyDisplayData<UserInfo>>>(
      `/api/orders/me?${params}`
    );
  }
}

const ordersService = new OrdersService();

export default ordersService;
