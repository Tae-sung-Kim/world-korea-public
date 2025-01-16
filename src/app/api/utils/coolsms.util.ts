import crypto from 'crypto';
import { format } from 'date-fns';

// 서명 생성 함수
export const createSignature = ({
  apiKey,
  apiSecret,
}: {
  apiKey: string;
  apiSecret: string;
}) => {
  const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  // crypto를 사용한 salt 생성 (12-64바이트)
  const salt = crypto.randomBytes(32).toString('hex').slice(0, 64);

  try {
    // 메시지 생성 (날짜 + 솔트, 공백 없이)
    const message = `${now}${salt}`;

    // HMAC-SHA256 알고리즘으로 서명 생성
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(message)
      .digest('hex'); // base64 대신 hex로 변경

    return `HMAC-SHA256 apiKey=${apiKey}, date=${now}, salt=${salt}, signature=${signature}`;
  } catch (error) {
    throw new Error('서명 생성 실패');
  }
};
