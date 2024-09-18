import { ProductFormData, SaleProductFormData } from '@/definitions';
import http from '@/services';
import qs from 'qs';

class SaleProductService {
  //상품 생성
  createSaleProduct(data: Partial<SaleProductFormData>) {
    return http.post<Partial<SaleProductFormData>>(`/api/sale-products`, data);
  }
}

const saleProductService = new SaleProductService();

export default saleProductService;
