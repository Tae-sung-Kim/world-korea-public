'use client';

import ProductDetailModal from '../../group-reservation/[id]/product-detail-modal';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { MODAL_TYPE, useModalContext } from '@/contexts/modal.context';
import { ProductFormData, SaleProductFormData } from '@/definitions';
import Image from 'next/image';
import { useMemo } from 'react';

type Props = {
  saleProductDetailData: Partial<SaleProductFormData<ProductFormData<string>>>;
  saleProductId: string;
};

export default function ProductDetailInfo({
  saleProductDetailData,
  saleProductId,
}: Props) {
  const { openModal } = useModalContext();

  const images = useMemo(
    () => saleProductDetailData.products?.map((d) => d.images).flat() ?? [],
    [saleProductDetailData]
  );

  //상품 상세 정보 팝업
  const handleDetailSaleProduct = () => {
    if (!!saleProductId) {
      return openModal({
        type: MODAL_TYPE.MODAL,
        title: '상품 상세 정보',
        useOverlayClose: true,
        Component: ({ onOk, onCancel }) => {
          return (
            <ProductDetailModal
              saleProductId={saleProductId}
              onOk={onOk}
              onCancel={onCancel}
            />
          );
        },
      });
    }
  };

  return (
    <div className="basis-1/3 mx-2">
      <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center">
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {images.map((d) => {
              return (
                <CarouselItem key={d}>
                  <div className="p-2">
                    <Image
                      className="w-full h-full rounded-full"
                      alt="상품 이미지"
                      width={150}
                      height={150}
                      src={String(d) ?? ''}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <h1 className="text-xl text-center font-bold">
        {saleProductDetailData.name}
      </h1>

      <div className="m-4">
        <Button
          variant="secondary"
          type="button"
          onClick={handleDetailSaleProduct}
        >
          상세정보
        </Button>
      </div>

      <div className="space-y-4">
        <ul className="text-sm text-wrap">
          <li className="p-3">
            주소: 서울특별시 송파구 올림픽로 240, 롯데월드 웰빙센터 SP라운지
            219호
          </li>
          <li className="p-3">전화번호: 02-415-8587 | 010-4074-8587</li>
          <li className="p-3">이메일: worldk70@daum.net</li>
        </ul>
      </div>
    </div>
  );
}
