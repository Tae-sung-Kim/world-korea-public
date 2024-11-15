import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import {
  NameAndId,
  PaginationResponse,
  SaleProductBuyDisplayData,
  SaleProductBuyFormData,
} from '@/definitions';
import http from '@/services';
import qs from 'qs';

class OrdersService {
  //상품 구매
  createOrder(data: SaleProductBuyFormData<string>) {
    return http.post<SaleProductBuyFormData<string>>('/api/orders', data);
  }

  //구매 목록
  getOrderList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<SaleProductBuyDisplayData<NameAndId>>>(
      `/api/orders?${params}`
    );
  }
}

const ordersService = new OrdersService();

export default ordersService;
