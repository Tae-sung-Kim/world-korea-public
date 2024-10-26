import { NotificationForm } from '@/definitions/notifications.type';
import http from '@/services';

class NotificationsService {
  //팝업 생성
  createNotifications(data: FormData) {
    return http.post<Partial<NotificationForm>>(`/api/notifications`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  //팝업 리스트
  getNotificationList() {
    return http.get<NotificationForm>(`/api/notifications`);
  }

  //팝업 삭제
  deleteNotification(id: string) {
    return http.delete(`/api/notifications/${id}`);
  }
}

const notificationService = new NotificationsService();

export default notificationService;
