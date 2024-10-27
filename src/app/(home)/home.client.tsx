'use client';

import { usePagination } from '../admin/hooks/usePagination';
import { useGetNotificationListQuery } from '../admin/queries/notifications.queries';
import HomePopupModal from './home-popup.modal';
import ProductImage from './product-image.component';
import ProductInfo from './product-info.component';
import { useModalContext } from '@/contexts/modal.context';
import { NotificationForm } from '@/definitions/notifications.type';
import { useSaleProductListQuery } from '@/queries/product.queries';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function HomeClient() {
  const { openModal } = useModalContext();
  const [openPopup, setOpenPopup] = useState(false);
  const openCountRef = useRef(0);

  // 팝업목록
  const notificationList = useGetNotificationListQuery();
  const [showNotificationList, setShowNotificationList] = useState<
    NotificationForm[]
  >([]);

  const { pageNumber, pageSize, filter } = usePagination({
    queryFilters: { name: '' },
  });

  const saleProductData = useSaleProductListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
  });

  // 쿠키값 확인
  useEffect(() => {
    if (Array.isArray(notificationList) && notificationList.length > 0) {
      const tempList = notificationList.reduce<NotificationForm[]>(
        (acc, cur) => {
          const isShow = !Cookies.get(cur._id ?? '');

          if (isShow) {
            acc.push(cur);
          }

          return acc;
        },
        []
      );
      setShowNotificationList(tempList);
    }
  }, [notificationList]);

  // 팝업을 하나씩만 띄우기
  useEffect(() => {
    if (
      !Array.isArray(showNotificationList) ||
      showNotificationList.length <= 0
    ) {
      return;
    }

    // 팝업이 처음에만 띄워지도록 설정
    if (!openPopup && openCountRef.current < showNotificationList.length) {
      openCountRef.current = showNotificationList.length;
      const showPopup = (index: number) => {
        if (index < showNotificationList.length) {
          openModal({
            useOverlayOpacity: false,
            showHeader: false,
            showFooter: false,
            Component: ({ onCancel }) => {
              return (
                <HomePopupModal
                  onCancel={onCancel}
                  data={showNotificationList[index]}
                />
              );
            },
            onCancel: () => {
              // 팝업이 닫힐 때 다음 팝업을 띄움
              showPopup(index + 1);
            },
          });
        }
      };

      showPopup(0); // 첫 번째 팝업을 띄움
      setOpenPopup(true); // 상태 변경하여 팝업이 다시 호출되지 않게 설정
    }
  }, [openPopup, openModal, showNotificationList]);

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
                  <ProductImage url={images[0]} />
                </div>
                <div className="mt-6">
                  <ProductInfo name={name} price={price} />
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
