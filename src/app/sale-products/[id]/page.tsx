import SaleProductDetailClient from './sale-product-detail.client';

export default function SellProductDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <SaleProductDetailClient saleProductId={params.id} />;
}
