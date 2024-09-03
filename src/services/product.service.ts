import { PaginationProp } from '@/app/admin/queries/queries.type';
import { PaginationResponse, ProductFormData } from '@/definitions';
import http from '@/services';
import qs from 'qs';

class ProductService {
  //상품 생성
  createProduct(data: FormData) {
    return http.post<Partial<ProductFormData>>(`/api/products`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  //상품 전체
  getProudctList(pageParams?: PaginationProp) {
    const { filter, ...otherParams } = pageParams ?? {};

    const params = qs.stringify(otherParams ?? {});
    let filterParams = '';
    //filter가 있다면
    if (Array.isArray(filter) && filter.length > 0) {
      console.log(filter);
      filter.forEach((d) => {
        filterParams += '&filter';
        filterParams += `[${d.key}]=${d.value}`;
      });
    }

    return http.get<PaginationResponse<ProductFormData>>(
      `/api/products?${params}${filterParams}`
    );
  }

  //개별 상품
  detailProudct(id: string) {
    return http.get<ProductFormData>(`/api/products/${id}`);
  }

  //상품 수정
  updateProduct({ id, data }: { id: string; data: FormData }) {
    return http.patch<Partial<ProductFormData>>(`/api/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  deleteProduct(id: string) {
    return http.delete(`/api/products/${id}`);
  }
}

const productService = new ProductService();

export default productService;
