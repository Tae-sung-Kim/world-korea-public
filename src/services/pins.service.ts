import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import { PaginationResponse } from '@/definitions';
import { Pin, PinUsed } from '@/definitions/pin.type';
import http from '@/services';
import qs from 'qs';

class PinsService {
  // 핀 생성
  createPin(data: Pin) {
    return http.post<Pin>(`/api/pins`, data);
  }

  // 핀 리스트
  getListPin(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<Pin>>(`api/pins?${params}`);
  }

  detailPin(id: string) {
    return http.get<Pin>(`api/pins/${id}`);
  }

  // 핀 삭제 - 단건
  deletePin(id: string) {
    return http.delete(`api/pins/${id}`);
  }

  // 핀 삭제 - 다건
  deletePins(ids: string[]) {
    return http.delete(`api/pins`, { data: { ids } });
  }

  // 핀 사용 여부
  usedDatePin(id: string, used: boolean) {
    return http.patch(`api/pins/used/${id}`, { used });
  }

  // 핀 사용 여부
  usedDatePinList({ pinNumberList }: PinUsed) {
    return http.post(`api/pins/used`, { pinNumberList });
  }

  // QRCODE(pin번호) 등록 여부
  usedPinQrCode(pinNumber: string) {
    return http.get(`api/pins/used/number/${pinNumber}`);
  }

  // 핀 리스트
  getPartnerListPin(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<Pin>>(`api/pins/partner?${params}`);
  }
}

const pinsService = new PinsService();

export default pinsService;
