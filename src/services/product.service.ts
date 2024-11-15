import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import {
  PaginationResponse,
  ProductDisplayData,
  ProductFormData,
  ProductImage,
} from '@/definitions';
import http from '@/services';
import qs from 'qs';

class ProductService {
  //상품 생성
  createProduct(data: FormData) {
    return http.post<Partial<ProductFormData<ProductImage>>>(
      `/api/products`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  //상품 전체
  getProudctList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<ProductDisplayData>>(
      `/api/products?${params}`
    );
  }

  //개별 상품
  detailProudct(id: string) {
    return http.get<ProductDisplayData>(`/api/products/${id}`);
  }

  //상품 수정
  updateProduct({ id, data }: { id: string; data: FormData }) {
    return http.patch<Partial<ProductFormData<string | ProductImage>>>(
      `/api/products/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  deleteProduct(id: string) {
    return http.delete(`/api/products/${id}`);
  }
}

const productService = new ProductService();

export default productService;
