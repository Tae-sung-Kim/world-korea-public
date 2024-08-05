import { ProductStatus } from '@/definitions';
import http from '@/services';

export interface ProductToCreate {
  name: string; // 상품명
  accessLevel: string; // 접근 레벨
  status: ProductStatus; // 상품 상태
  images: File[]; // 상품 이미지
  regularPrice: string; // 정가
  salePrice: string; // 할인가
  price: string; // 판매가
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  // unavailableDates?: Date[]; // 이용 불가능 날짜
}

class ProductService {
  createProduct(data: FormData) {
    return http.post<ProductToCreate>(`/api/products`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

const productService = new ProductService();

export default productService;
