'use client';

import SaleProductDeaitlBottom from './sale-product-detail-bottom.component';
import SaleProductDetailForm from './sale-product-detail-form.component';
import SaleProductDeaitlImage from './sale-product-detail-image.component';
import SaleProductDetailInfo from './sale-product-detail-info.component';
import { useDetailSaleProductQuery } from '@/queries/product.queries';
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
    <>
      {/* 이미지 섹션 */}
      <SaleProductDeaitlImage images={images} />

      {/* 상품 Form 섹션 */}
      <SaleProductDetailForm
        saleProductId={saleProductId}
        saleProductDetailData={saleProductDetailData}
      />

      {/* 이용 안내 섹션 */}
      <SaleProductDetailInfo productList={productList} />

      {/* 상품 상세 정보 섹션 */}
      <SaleProductDeaitlBottom productList={productList} />
    </>
  );
}
