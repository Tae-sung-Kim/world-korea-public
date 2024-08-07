'use client';

import productService from '@/services/product.service';
import { useQuery } from '@tanstack/react-query';

export default function ProductDetailClient({
  productId,
}: {
  productId: string;
}) {
  const { data: productItem, isFetching } = useQuery({
    queryKey: ['detailProduct', productId],
    queryFn: () => productService.detailProudct(productId),
  });

  console.log(productItem);

  return 'ProductDetailClient';
}
