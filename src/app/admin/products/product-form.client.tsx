'use client';

import DetailTitle from '@/app/components/common/detail-title.compoent';
import ProductDetail from '@/app/components/products/product-detail.component';

export default function ProductFormClient({
  productId,
}: {
  productId?: string;
}) {
  return (
    <>
      {productId && <DetailTitle title="상품 상세" />}
      <ProductDetail productId={productId} />;
    </>
  );
}
