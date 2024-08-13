'use client';

import ProductForm from './product-form';
import userCategoryService from '@/services/user-category.service';
import { useQuery } from '@tanstack/react-query';

export default function ProductFormClient({
  productId,
}: {
  productId?: string;
}) {
  //회원 등급 조회
  const { data: userCategoryList } = useQuery({
    queryKey: ['user-categories', 'products'],
    queryFn: userCategoryService.getUserCategoryList,
  });

  return (
    <ProductForm userCategoryList={userCategoryList} productId={productId} />
  );
}
