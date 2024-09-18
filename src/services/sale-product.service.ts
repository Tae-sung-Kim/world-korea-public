import { ProductFormData, SaleProductFormData } from '@/definitions';
import http from '@/services';
import qs from 'qs';

class SaleProductService {
  //상품 생성
  createSaleProduct(data: SaleProductFormData) {
    return http.post<SaleProductFormData>(`/api/sale-products`, data);
  }
}

const saleProductService = new SaleProductService();

export default saleProductService;
