import SaleProductForm from '../sale-product-form';

export default function SaleProductDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <SaleProductForm productId={params.id} />;
}
