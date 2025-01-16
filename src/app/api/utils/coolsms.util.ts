import crypto from 'crypto';
import { format } from 'date-fns';

// CoolSMS 날짜 형식 생성 함수
const formatCoolSMSDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(now.getDate()).padStart(2, '0')} ${String(
    now.getHours()
  ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
    now.getSeconds()
  ).padStart(2, '0')}`;
};

// 서명 생성 함수
export const createSignature = ({
  apiKey,
  apiSecret,
}: {
  apiKey: string;
  apiSecret: string;
}) => {
  // const now = formatCoolSMSDate();
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
