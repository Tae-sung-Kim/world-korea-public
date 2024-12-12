import { UserInfo, SaleProductBuyDisplayData } from '@/definitions';
import http from '@/services';

class ShortService {
  // shortId 에 해당하는 pin 의 _id 반환
  getOrderIdByShortId(shortId: string) {
    return http.get<SaleProductBuyDisplayData<UserInfo>>(
      `/api/orders/short/${shortId}`
    );
  }
}

const shortService = new ShortService();

export default shortService;
