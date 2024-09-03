import { PaginationProp } from '@/app/admin/queries/queries.type';
import { PaginationResponse } from '@/definitions';
import { Pin } from '@/definitions/pins.type';
import http from '@/services';
import qs from 'qs';

class PinsService {
  //핀 생성
  createPin(data: Pin) {
    return http.post<Pin>(`/api/pins`, data);
  }

  //핀 리스트
  getListPin(pageParams?: PaginationProp) {
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
}

const pinsService = new PinsService();

export default pinsService;
