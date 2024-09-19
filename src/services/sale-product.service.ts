import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import {
  PaginationResponse,
  ProductFormData,
  SaleProductFormData,
} from '@/definitions';
import http from '@/services';
import qs from 'qs';

class SaleProductService {
  //상품 생성
  createSaleProduct(data: SaleProductFormData) {
    return http.post<SaleProductFormData>(`/api/sale-products`, data);
  }

  //상품 목록
  getSaleProudctList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<ProductFormData>>(
      `/api/sale-products?${params}`
    );
  }
}

const saleProductService = new SaleProductService();

export default saleProductService;
