'use client';

import { useUserCategoryListQuery } from '../queries';
import ProductForm from './product-form';

export default function ProductFormClient({
  productId,
}: {
  productId?: string;
}) {
  //회원 등급 조회
  const userCategoryList = useUserCategoryListQuery();

  return (
    <ProductForm userCategoryList={userCategoryList} productId={productId} />
  );
}
