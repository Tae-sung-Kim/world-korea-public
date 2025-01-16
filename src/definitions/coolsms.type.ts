export type SmsInfo = {
  name: string;
  payType: string;
  amount: string;
  quantity: number;
};

// 문자 요청
export type SMSRequest = {
  text: string;
  to?: string;
  subject?: string;
};

// 문자 결과
export interface SMSResponse {
  success: boolean;
  data?: any;
  error?: string;
}
