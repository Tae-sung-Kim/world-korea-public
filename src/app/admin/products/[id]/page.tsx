import ProductFormClient from '../product-form.client';

export default function ProductDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <ProductFormClient productId={params.id} />;
}
