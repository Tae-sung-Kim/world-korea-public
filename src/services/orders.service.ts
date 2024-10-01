import { SaleProductBuyFormData } from '@/definitions';
import http from '@/services';

class OrdersService {
  //상품 구매
  createOrder(data: SaleProductBuyFormData) {
    return http.post<SaleProductBuyFormData>('/api/orders', data);
  }
}

const ordersService = new OrdersService();

export default ordersService;
