'use client';

import { usePagination } from '../admin/hooks/usePagination';
import HomePopupModal from './home-popup.modal';
import { useModalContext } from '@/contexts/modal.context';
import { useSaleProductListQuery } from '@/queries/product.queries';
import { addComma } from '@/utils/number';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const POPUP_DATA = ['이미지1', '이미지2', '이미지3', '이미지4'];

export default function HomeClient() {
  const { openModal } = useModalContext();
  const [openPopup, setOpenPopup] = useState(false);
  const openCountRef = useRef(0);

  const { pageNumber, pageSize, filter } = usePagination({
    queryFilters: { name: '' },
  });

  const saleProductData = useSaleProductListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
  });

  //팝업을 하나씩만 띄우기
  useEffect(() => {
    // 팝업이 처음에만 띄워지도록 설정
    console.log(
      'openPopup',
      openPopup,
      openCountRef.current,
      POPUP_DATA.length
    );
    if (!openPopup && openCountRef.current <= POPUP_DATA.length) {
      console.log(
        'openPopup1',
        openPopup,
        openCountRef.current,
        POPUP_DATA.length
      );

      openCountRef.current = POPUP_DATA.length;
      const showPopup = (index: number) => {
        if (index < POPUP_DATA.length) {
          openModal({
            useOverlayOpacity: false,
            showHeader: false,
            showFooter: false,
            Component: ({ onCancel }) => {
              return (
                <HomePopupModal onCancel={onCancel}>
                  {POPUP_DATA[index]}
                </HomePopupModal>
              );
            },
            onCancel: () => {
              // 팝업이 닫힐 때 다음 팝업을 띄움
              showPopup(index + 1);
            },
          });
        }
      };

      console.log(
        'openPopup2',
        openPopup,
        openCountRef.current,
        POPUP_DATA.length
      );

      showPopup(0); // 첫 번째 팝업을 띄움
      setOpenPopup(true); // 상태 변경하여 팝업이 다시 호출되지 않게 설정
    }
  }, [openPopup, openModal]); // 의존성 배열에 isPopupShown 추가

  // //모두 띄울때 - 다건 한번에
  // useEffect(() => {
  //   (async () => {
  //     if (POPUP_DATA.length > 0 && openCountRef.current < POPUP_DATA.length) {
  //       openCountRef.current = POPUP_DATA.length;
  //       POPUP_DATA.map((d) => {
  //         return openModal({
  //           useOverlayOpacity: false,
  //           showFooter: false,
  //           Component: () => {
  //             return <HomePopupModal>{d}</HomePopupModal>;
  //           },
  //         });
  //       });
  //     }
  //   })();
  // }, [openModal]);

  if (!Array.isArray(saleProductData?.list)) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-8">
      {saleProductData.list.map((d) => {
        const { _id, name, price, products } = d;

        const images = products.map((d2) => d2.images).flat();

        return (
          <div key={_id} className="flex items-center justify-center py-12">
            <div className="py-6 px-4 w-full bg-white shadow-2xl relative rounded hover:-translate-y-2 hover:transition-transform hover:ease-in">
              <Link href={`/sale-products/${_id}`}>
                <div
                  className="aspect-[5/4] relative rounded"
                  style={{
                    marginTop: 'calc((2.5rem)* -1)',
                  }}
                >
                  {/* <div className="absolute">
                    <div className="animate-fade">재고량 : </div>
                    <div className="animate-fade">사용량 : </div>
                  </div> */}
                  {images[0] && (
                    <Image
                      alt="상품 이미지"
                      className="w-full h-full rounded shadow-xl"
                      priority={true}
                      width={180}
                      height={180}
                      src={String(images[0])}
                    />
                  )}
                </div>
                <div className="mt-6">
                  <div className="text-lg font-medium">{name}</div>
                  <div className="text-gray-500 mt-1 tracking-wide">
                    ₩{addComma(price)}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
