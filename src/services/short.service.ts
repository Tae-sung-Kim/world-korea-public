import http from '@/services';

class ShortService {
  // shortId 에 해당하는 판매상품의 _id 반환
  getSaleProductIdByShortId(shortId: string) {
    return http.get<string>(`/api/sale-products/short/${shortId}`);
  }
}

const shortService = new ShortService();

export default shortService;
