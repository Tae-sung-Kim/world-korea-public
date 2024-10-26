'use client';

import {
  useDeleteNotificationMutation,
  useGetNotificationListQuery,
} from '../queries';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Fragment } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function NotificationsListClient() {
  const notificationList = useGetNotificationListQuery();

  const deleteNotificationMutation = useDeleteNotificationMutation();

  const handleDeleteNotification = (id: string = '') => {
    deleteNotificationMutation.mutate(id);
  };

  return (
    <div className="container">
      {Array.isArray(notificationList) &&
        notificationList.map((d, idx) => {
          return (
            <Fragment key={d._id}>
              <span>번호 : {idx + 1}</span>
              <div>제목 : {d.title}</div>
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteNotification(d._id)}
                >
                  <RiDeleteBin6Line />
                </Button>
              </div>
              <div className="flex">
                이미지 :
                {d.image && typeof d.image === 'string' && (
                  <Image
                    src={d.image}
                    width={250}
                    height={250}
                    alt="팝업 이미지"
                  />
                )}
              </div>
            </Fragment>
          );
        })}
    </div>
  );
}
