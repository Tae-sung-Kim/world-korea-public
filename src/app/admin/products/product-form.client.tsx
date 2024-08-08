'use client';

import ProductForm from './product-form';
import productService from '@/services/product.service';
import userCategoryService from '@/services/user-category.service';
import { useQuery } from '@tanstack/react-query';

export default function ProductFormClient({
  productId = '',
}: {
  productId?: string;
}) {
  //회원 등급 조회
  const { data: userCategoryList } = useQuery({
    queryKey: ['user-categories', 'products'],
    queryFn: userCategoryService.getUserCategoryList,
  });

  //상품 상세 조회
  const { data: productDetail, isFetching } = useQuery({
    queryKey: ['detailProduct', productId],
    queryFn: () => productService.detailProudct(productId),
    enabled: !!productId,
  });

  return (
    <ProductForm
      userCategoryList={userCategoryList}
      productDetail={productDetail}
    />
  );
}
