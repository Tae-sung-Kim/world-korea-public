import { ProductFormData } from '@/definitions';
import http from '@/services';

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
  getProudctList() {
    return http.get<ProductFormData[]>('/api/products');
  }

  //개별 상품
  detailProudct(id: string) {
    return http.get<ProductFormData>(`/api/products/${id}`);
  }
}

const productService = new ProductService();

export default productService;
