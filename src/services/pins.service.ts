import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import { PaginationResponse } from '@/definitions';
import { Pin, PinUsed } from '@/definitions/pins.type';
import http from '@/services';
import qs from 'qs';

class PinsService {
  //핀 생성
  createPin(data: Pin) {
    return http.post<Pin>(`/api/pins`, data);
  }

  //핀 리스트
  getListPin(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<Pin>>(`api/pins?${params}`);
  }

  detailPin(id: string) {
    return http.get<Pin>(`api/pins/${id}`);
  }

  //핀 삭제
  deletePin(id: string) {
    return http.delete(`api/pins/${id}`);
  }

  //핀 사용 여부
  usedDatePin(id: string) {
    return http.patch(`api/pins/used/${id}`, { used: true });
  }

  //핀 사용 여부
  usedDatePinList({ pinNumberList }: PinUsed) {
    return http.post(`api/pins/used`, { pinNumberList });
  }
}

const pinsService = new PinsService();

export default pinsService;
