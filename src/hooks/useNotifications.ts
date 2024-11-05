import HomePopupModal from '@/app/admin/modals/home-popup.modal';
import { useGetNotificationListQuery } from '@/app/admin/queries';
import { useModalContext } from '@/contexts/modal.context';
import { NotificationForm } from '@/definitions/notifications.type';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';

export default function useNotifications() {
  const { openModal } = useModalContext();
  const openCountRef = useRef(0);
  const [showNotificationList, setShowNotificationList] = useState<
    NotificationForm[]
  >([]);

  // 팝업 목록을 가져오는 쿼리
  const notificationList = useGetNotificationListQuery();

  // 쿠키 값을 확인하여 팝업 목록 필터링
  useEffect(() => {
    if (Array.isArray(notificationList) && notificationList.length > 0) {
      const tempList = notificationList.filter(
        (notification) => !Cookies.get(notification._id ?? '')
      );
      setShowNotificationList(tempList);
    }
  }, [notificationList]);

  // 팝업을 하나씩 띄우기
  useEffect(() => {
    const showPopup = (index: number) => {
      if (index < showNotificationList.length) {
        openModal({
          useOverlayOpacity: false,
          showHeader: false,
          showFooter: false,
          Component: ({ onCancel }) => {
            // ts확장자에서는 순수 tsx(jsx)를 지원하지 않음
            return React.createElement(HomePopupModal, {
              onCancel,
              data: showNotificationList[index],
            });
          },
          onCancel: () => showPopup(index + 1), // 팝업이 닫힐 때 다음 팝업을 띄움
        });
      }
    };

    if (
      showNotificationList.length > 0 &&
      openCountRef.current < showNotificationList.length
    ) {
      openCountRef.current = showNotificationList.length; // 총 알림 개수 업데이트
      showPopup(0); // 첫 번째 팝업을 띄움
    }
  }, [showNotificationList, openModal]);

  return { showNotificationList }; // 필요에 따라 추가 데이터 반환
}
