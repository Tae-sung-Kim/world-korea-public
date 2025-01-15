import { createResponse } from '../utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import axios from 'axios';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
  try {
    const { to, text } = await req.json();

    const apiKey = process.env.COOLSMS_API_KEY!;
    const apiSecret = process.env.COOLSMS_API_SECRET!;
    const endpoint = process.env.COOLSMS_API_URL!;
    const sender = process.env.COOLSMS_SENDER_PHONE_NUMBER!;

    // CoolSMS 특정 날짜 형식 사용
    const now = formatCoolSMSDate();

    // crypto를 사용한 salt 생성 (12-64바이트)
    const salt = crypto.randomBytes(32).toString('hex').slice(0, 64);

    // 서명 생성 함수
    const createSignature = (secret: string, date: string, salt: string) => {
      try {
        // 메시지 생성 (날짜 + 솔트, 공백 없이)
        const message = `${date}${salt}`;

        // HMAC-SHA256 알고리즘으로 서명 생성
        const signature = crypto
          .createHmac('sha256', secret)
          .update(message)
          .digest('hex'); // base64 대신 hex로 변경

        return signature;
      } catch (error) {
        throw new Error('서명 생성 실패');
      }
    };

    // 서명 생성
    const signature = createSignature(apiSecret, now, salt);

    // Authorization 헤더 생성
    const authHeader = `HMAC-SHA256 apiKey=${apiKey}, date=${now}, salt=${salt}, signature=${signature}`;

    // CoolSMS API 페이로드 구조 수정
    const payload = {
      message: {
        to: to,
        from: sender,
        text: text,
        type: 'SMS',
      },
    };

    try {
      const response = await axios.post(
        `${endpoint}/messages/v4/send`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
          timeout: 10000,
        }
      );

      return NextResponse.json({
        success: true,
        data: response.data,
      });
    } catch (axiosError: any) {
      return createResponse(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        axiosError.response?.data?.errorMessage ||
          'SMS 전송 중 외부 API 오류 발생'
      );
    }
  } catch (error: any) {
    return createResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      '서버 내부 처리 중 오류 발생'
    );
  }
}
