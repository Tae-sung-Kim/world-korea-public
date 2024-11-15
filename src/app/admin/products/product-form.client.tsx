'use client';

import ProductDetail from '@/app/components/products/product-detail.component';

export default function ProductFormClient({
  productId,
}: {
  productId?: string;
}) {
  return <ProductDetail productId={productId} />;
}
