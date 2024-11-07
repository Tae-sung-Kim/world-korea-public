'use client';

import ProductDetail from '../components/product-detail.component';

export default function ProductFormClient({
  productId,
}: {
  productId?: string;
}) {
  return <ProductDetail productId={productId} />;
}
