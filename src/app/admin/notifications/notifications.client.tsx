'use client';

import {
  useDeleteNotificationMutation,
  useGetNotificationListQuery,
} from '../queries';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Fragment } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NotificationsListClient() {
  const notificationList = useGetNotificationListQuery();

  const deleteNotificationMutation = useDeleteNotificationMutation();

  const handleDeleteNotification = (id: string = '') => {
    deleteNotificationMutation.mutate(id);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">알림 관리</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(notificationList) &&
          notificationList.map((d, idx) => {
            return (
              <Card key={d._id} className="overflow-hidden">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      #{idx + 1}
                    </CardTitle>
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
                  {d.image && typeof d.image === 'string' && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={d.image}
                        fill
                        className="object-cover"
                        alt={d.title || '팝업 이미지'}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
