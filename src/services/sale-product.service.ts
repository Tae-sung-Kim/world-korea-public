import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import {
  PackageDetailName,
  PaginationResponse,
  ProductFormData,
  SaleProductFormData,
} from '@/definitions';
import http from '@/services';
import qs from 'qs';

class SaleProductService {
  //판매 생성
  createSaleProduct(data: SaleProductFormData<string>) {
    return http.post<SaleProductFormData<string>>(`/api/sale-products`, data);
  }

  //판매 목록
  getSaleProudctList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<SaleProductFormData<PackageDetailName>>>(
      `/api/sale-products?${params}`
    );
  }

  //판매 상세
  detailSaleProudct(id: string) {
    return http.get<SaleProductFormData<ProductFormData>>(
      `/api/sale-products/${id}`
    );
  }
}

const saleProductService = new SaleProductService();

export default saleProductService;
