import SaleProductDetailForm from './sale-product-detail-form';

export default function SaleProductDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <SaleProductDetailForm productId={params.id} />;
}
