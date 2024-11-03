import SaleProductDetailClient from './sale-product-detail.client';

export default function SellProductDetailPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  return <SaleProductDetailClient saleProductId={id} />;
}
