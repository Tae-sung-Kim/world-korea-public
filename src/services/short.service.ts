import { UserInfo, SaleProductBuyDisplayData, Pin } from '@/definitions';
import http from '@/services';

class ShortService {
  // shortId 에 해당하는 pin 의 _id 반환
  getOrderIdByShortId(shortId: string) {
    return http.get<SaleProductBuyDisplayData<UserInfo>>(
      `/api/orders/short/${shortId}`
    );
  }
  // shortId 에 해당하는 판매 상품 id
  getSaleProductIdByShortId(shortId: string) {
    return http.get<string>(`/api/sale-products/short/${shortId}`);
  }

  // shortId로 주문 ticket 찾기
  getTicketByShortId(shortId: string) {
    return http.get<Pin>(`/api/pins/short/${shortId}`);
  }
}

const shortService = new ShortService();

export default shortService;
