'use client';

import ProductForm from './product-form';

export default function ProductFormClient({
  productId,
}: {
  productId?: string;
}) {
  //회원 등급 조회

  return <ProductForm productId={productId} />;
}
