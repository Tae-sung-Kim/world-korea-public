import { PinsData } from '@/definitions/pins.type';
import http from '@/services';

class PinsService {
  //핀 생성
  createPin(data: PinsData) {
    return http.post<PinsData>(`/api/pins`, data);
  }

  //핀 리스트
  getListPin() {
    return http.get<PinsData[]>(`api/pins`);
  }
}

const pinsService = new PinsService();

export default pinsService;
