'use client';

import SaleProductDetailBottom from './sale-product-detail-bottom.component';
import SaleProductDetailForm from './sale-product-detail-form.component';
import SaleProductDetailImage from './sale-product-detail-image.component';
import SaleProductDetailInfo from './sale-product-detail-info.component';
import { useDetailSaleProductQuery } from '@/queries/products.queries';
import { useMemo } from 'react';

type Props = {
  saleProductId: string;
};

export default function SaleProductDetailClient({ saleProductId }: Props) {
  const saleProductDetailData = useDetailSaleProductQuery(saleProductId);

  const productList = useMemo(
    () => saleProductDetailData.products ?? [],
    [saleProductDetailData.products]
  );

  // 모든 상품 이지미
  const images = useMemo(
    () => productList.map((d) => d.images).flat() ?? [],
    [productList]
  );

  if (Object.keys(saleProductDetailData).length < 1) {
    return false;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 이미지 섹션 */}
        <SaleProductDetailImage
          images={images}
          title={saleProductDetailData.name ?? ''}
        />

        {/* 상품 Form 섹션 */}
        <SaleProductDetailForm
          saleProductId={saleProductId}
          saleProductDetailData={saleProductDetailData}
        />
      </div>
      {/* 이용 안내 섹션 */}
      <SaleProductDetailInfo productList={productList} />

      {/* 상품 상세 정보 섹션 */}
      <SaleProductDetailBottom productList={productList} />
    </div>
  );
}
