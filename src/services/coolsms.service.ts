import { SMSRequest, SMSResponse } from '@/definitions/coolsms.type';
import http from '@/services';

class CoolSmsService {
  sendSms({ subject, to, text }: SMSRequest) {
    return http.post<SMSResponse>(`/api/coolsms`, { to, text, subject });
  }
}

const coolSmsService = new CoolSmsService();

export default coolSmsService;
