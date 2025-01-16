import { createSignature } from '../utils/coolsms.util';
import { createResponse } from '../utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { subject = '제목없음', to, text } = await req.json();

    const apiKey = process.env.COOLSMS_API_KEY!;
    const apiSecret = process.env.COOLSMS_API_SECRET!;
    const endpoint = process.env.COOLSMS_API_URL!;
    const sender = process.env.COOLSMS_SENDER_PHONE_NUMBER!;

    // 서명 생성
    const Authorization = createSignature({ apiKey, apiSecret });

    // CoolSMS API 페이로드 구조 수정
    const payload = {
      message: {
        subject,
        to: to,
        from: sender,
        text: text,
      },
    };

    try {
      const response = await axios.post(
        `${endpoint}/messages/v4/send`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization,
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
