'use client';

import {
  useDeleteNotificationMutation,
  useGetNotificationListQuery,
} from '../queries';
import TotalCountBottom from '@/app/components/total-count-bottom.component';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationDisplayData } from '@/definitions/notifications.type';
import Image from 'next/image';
import { useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import NotificationsImage from './notifications-image.component';

export default function NotificationsListClient() {
  const notificationList =
    useGetNotificationListQuery() as NotificationDisplayData<string>[];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const deleteNotificationMutation = useDeleteNotificationMutation();

  const handleDeleteNotification = (id: string = '') => {
    deleteNotificationMutation.mutate(id);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1920px] mx-auto">
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(notificationList) &&
              notificationList.map((d, idx) => (
                <Card key={d._id} className="overflow-hidden">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">#{idx + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNotification(d._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <RiDeleteBin6Line className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="font-semibold text-lg">{d.title}</h3>
                    {d.image && (
                      <div
                        className="relative aspect-video w-full overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(d.image)}
                      >
                        <Image
                          src={d.image}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                          alt={d.title || '팝업 이미지'}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <TotalCountBottom title="총 팝업" count={notificationList?.length} />
      </div>

      <NotificationsImage
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
