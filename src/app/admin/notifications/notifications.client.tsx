'use client';

import { useGetNotificationListQuery } from '../queries/notifications.queries';
import Image from 'next/image';
import { Fragment } from 'react';

export default function NotificationsListClient() {
  const notificationList = useGetNotificationListQuery();

  return (
    <div className="container">
      {Array.isArray(notificationList) &&
        notificationList.map((d, idx) => {
          return (
            <Fragment key={d._id}>
              <span>번호 : {idx + 1}</span>
              <div>제목 : {d.title}</div>
              {d.image && typeof d.image === 'string' && (
                <Image
                  src={d.image}
                  width={250}
                  height={250}
                  alt="팝업 이미지"
                />
              )}
            </Fragment>
          );
        })}
    </div>
  );
}
