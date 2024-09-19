import SaleProductForm from '../create/sale-product-create-form';

export default function SaleProductDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <SaleProductForm productId={params.id} />;
}
