'use client';

import SaleProductDetail from '@/app/admin/sale-products/[id]/sale-product-detail.component';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDetailSaleProductQuery } from '@/queries/product.queries';

type DetailProps = {
  saleProductId: string;
  onOk?: () => void;
  onCancel?: () => void;
};

export default function ProductDetailModal({
  saleProductId,
  onCancel,
}: DetailProps) {
  const detailSaleProductData = useDetailSaleProductQuery(saleProductId);

  return (
    <ScrollArea className="w-[1000px] h-[800px]">
      <SaleProductDetail products={detailSaleProductData.products ?? []} />

      <div className="flex justify-center">
        <Button type="button" onClick={onCancel}>
          닫기
        </Button>
      </div>
    </ScrollArea>
  );
}
