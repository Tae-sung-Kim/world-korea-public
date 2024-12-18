import { GroupReservtionForm } from '@/definitions';
import '@/definitions/notifications.type';
import http from '@/services';

class GroupReservationService {
  // 단체 예약 생성
  createGroupReservation(data: GroupReservtionForm) {
    const usedAt = data.appointmentDate;

    return http.post(`/api/group-reservations`, {
      customData: data,
      usedAt,
    });
  }
}

const groupReservationService = new GroupReservationService();

export default groupReservationService;
