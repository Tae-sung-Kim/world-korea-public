import { SmsInfo, SMSRequest, SMSResponse } from '@/definitions/coolsms.type';
import coolSmsService from '@/services/coolsms.service';
import userService from '@/services/user.service';
import { addComma } from '@/utils/number';
import { useState } from 'react';

export const useCoolSMS = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SMSResponse | null>(null);

  const sendSMS = async ({ name, payType, amount, quantity }: SmsInfo) => {
    const text = `상품명: ${name},
결제수단: ${payType},
결제금액: ${addComma(amount)} 원,
수량: ${quantity} 개
결제가 완료 되었습니다.
마이페이지 > 구매목록 에서 확인 가능합니다.
감사합니다.`;

    await sendCoolSMS({
      text,
      subject: name + ' 결제 완료',
    });
  };

  const sendCoolSMS = async ({ subject, to, text }: SMSRequest) => {
    setLoading(true);
    setResponse(null);

    const { phoneNumber } = await userService.getCurrentUser();

    const toPhoneNumber = to ?? phoneNumber.replace(/-/g, '');

    const title = subject ?? '결제 완료';

    try {
      const result = await coolSmsService.sendSms({
        to: toPhoneNumber,
        text,
        subject: title,
      });

      setResponse({
        success: true,
        data: result,
      });

      return result;
    } catch (error: any) {
      const errorMessage =
        error.response?.data || error.message || 'Failed to send SMS';

      setResponse({
        success: false,
        error: errorMessage,
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    onSendSMS: sendSMS,
    loading,
    response,
  };
};
