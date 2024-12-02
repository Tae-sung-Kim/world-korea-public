import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import {
  NameAndId,
  PaginationResponse,
  PaymentRequest,
  SaleProductBuyDisplayData,
  SaleProductBuyFormData,
} from '@/definitions';
import http from '@/services';
import qs from 'qs';

class OrdersService {
  //상품 구매
  createOrder(data: SaleProductBuyFormData<string>) {
    return http.post<SaleProductBuyDisplayData<string>>('/api/orders', data);
  }

  //구매 목록
  getOrderList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<SaleProductBuyDisplayData<NameAndId>>>(
      `/api/orders?${params}`
    );
  }

  createPayment({ orderId, paymentId }: PaymentRequest) {
    return http.post<string>(`/api/orders/${orderId}/confirm-payment`, {
      paymentId,
    });
  }

  createRefund({ orderId, paymentId }: PaymentRequest) {
    return http.post<string>(`/api/orders/${orderId}/refund`, {
      paymentId,
    });
  }
}

const ordersService = new OrdersService();

export default ordersService;
