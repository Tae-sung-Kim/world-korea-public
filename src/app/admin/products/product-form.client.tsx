'use client';

import ProductForm from './product-form';

export default function ProductFormClient({
  productId,
}: {
  productId?: string;
}) {
  return <ProductForm productId={productId} />;
}
