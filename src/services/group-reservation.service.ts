import { GroupReservtionForm } from '@/definitions';
import '@/definitions/notifications.type';
import http from '@/services';

class GroupReservationService {
  // 단체 예약 생성
  createGroupReservation(data: GroupReservtionForm) {
    return http.post<GroupReservtionForm>(`/api/group-reservations`, data);
  }
}

const groupReservationService = new GroupReservationService();

export default groupReservationService;
