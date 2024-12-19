import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import {
  GroupReservation,
  GroupReservationForm,
  PaginationResponse,
} from '@/definitions';
import '@/definitions/notifications.type';
import http from '@/services';
import qs from 'qs';

class GroupReservationService {
  // 단체 예약 생성
  createGroupReservation(data: GroupReservationForm) {
    const usedAt = data.appointmentDate;

    return http.post(`/api/group-reservations`, {
      customData: data,
      usedAt,
    });
  }

  // 단체 예약 목록
  getGroupReservationList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});
    return http.get<PaginationResponse<GroupReservation>>(
      `/api/group-reservations?${params}`
    );
  }

  getGroupReservationDetails(id: string) {
    return http.get<GroupReservation>(`/api/group-reservations/${id}`);
  }
}

const groupReservationService = new GroupReservationService();

export default groupReservationService;
