import connectMongo from '@/app/api/libs/database';
import OrderModel from '@/app/api/models/order.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS, OrderStatus } from '@/definitions';
import { NextRequest } from 'next/server';

/**
 * 포트원 웹훅 처리
 * 결제 완료시 호출되는 엔드포인트
 */

/**
 * API 호출 함수
 */
async function callOrderAPI(
  orderId: string,
  endpoint: string,
  method: string,
  req: NextRequest,
  body?: object
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const internalToken = process.env.INTERNAL_API_TOKEN;

  if (!baseUrl || !internalToken) {
    throw new Error(
      'Required environment variables are missing: ' +
        JSON.stringify({ baseUrl: !!baseUrl, internalToken: !!internalToken })
    );
  }

  const url = `${baseUrl}/api/orders/${orderId}/${endpoint}`;
  console.log(`[포트원 웹훅] API 호출 시작: ${endpoint}`, {
    url,
    method,
    body: JSON.stringify(body),
  });

  // 내부 API 호출에는 INTERNAL_API_TOKEN만 사용
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${internalToken}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[포트원 웹훅] API 호출 실패:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(`API 호출 실패: ${endpoint} - ${errorText}`);
  }

  console.log('[포트원 웹훅] API 호출 성공:', {
    status: response.status,
    endpoint,
  });

  return response.json();
}

// 포트원 웹훅 요청 검증
const validatePortoneWebhook = async (req: NextRequest) => {
  // 포트원 API 시크릿 키 확인
  const portoneApiKey = process.env.PORTONE_SECRET_API;
  if (!portoneApiKey) {
    console.error('PORTONE_SECRET_API is not set');
    return false;
  }

  // 개발 환경에서는 signature 검증 스킵
  if (process.env.NODE_ENV === 'development') {
    console.log('[포트원 웹훅] 개발 환경에서는 signature 검증 스킵');
    return true;
  }

  // 포트원 웹훅 헤더 검증
  const signature = req.headers.get('x-portone-signature');
  if (!signature) {
    console.error('Missing Portone signature header');
    return false;
  }

  // TODO: 포트원 웹훅 서명 검증 로직 추가
  // 실제 프로덕션에서는 포트원에서 제공하는 방식으로 서명을 검증해야 함
  // 참고: https://developers.portone.io/docs/ko/api/webhook
  console.log('[포트원 웹훅] 서명 검증:', { signature });

  return true;
};

export async function POST(req: NextRequest) {
  try {
    // 포트원 웹훅 검증
    // if (!(await validatePortoneWebhook(req))) {
    //   return createResponse(
    //     HTTP_STATUS.UNAUTHORIZED,
    //     '유효하지 않은 웹훅 요청'
    //   );
    // }

    console.log('[포트원 웹훅] 요청 헤더:', {
      headers: Object.fromEntries(req.headers.entries()),
    });

    const body = await req.json();
    console.log('[포트원 웹훅] 요청 body:', JSON.stringify(body, null, 2));

    const { imp_uid, merchant_uid, status } = body;

    // ready 상태는 무시 (프론트엔드에서 처리)
    if (status === 'ready') {
      console.log('[포트원 웹훅] ready 상태는 프론트엔드에서 처리');
      return createResponse(HTTP_STATUS.OK, 'ready 상태는 프론트엔드에서 처리');
    }

    if (!imp_uid || !merchant_uid || !status) {
      console.error(
        '[포트원 웹훅] 필수 파라미터 누락:',
        JSON.stringify({ imp_uid, merchant_uid, status }, null, 2)
      );
      return createResponse(
        HTTP_STATUS.BAD_REQUEST,
        '필수 파라미터가 누락되었습니다.'
      );
    }

    // MongoDB 연결
    await connectMongo();

    console.log('[포트원 웹훅] 환경변수 확인:', {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      hasInternalToken: !!process.env.INTERNAL_API_TOKEN,
    });

    console.log('[포트원 웹훅] 주문 조회 시작:', { merchant_uid });

    // 최대 3번 재시도, 1초 간격
    let retryCount = 0;
    let order = null;

    while (retryCount < 3) {
      order = await OrderModel.findOne({
        merchantId: merchant_uid,
      });

      if (order) break;

      console.log(`[포트원 웹훅] 주문 조회 재시도 (${retryCount + 1}/3)`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retryCount++;
    }

    if (!order) {
      console.error('[포트원 웹훅] 주문을 찾을 수 없음:', {
        merchant_uid,
        retryCount,
      });
      return createResponse(HTTP_STATUS.NOT_FOUND, '주문을 찾을 수 없습니다.');
    }

    console.log('[포트원 웹훅] 주문 정보:', {
      orderId: order._id,
      currentStatus: order.status,
      merchantId: merchant_uid,
      requestStatus: status,
      retryCount,
    });

    switch (status) {
      case 'paid':
        // 결제 완료 처리 (일반 결제와 가상계좌 모두)
        await callOrderAPI(order._id, 'confirm-payment', 'POST', req, {
          paymentId: imp_uid,
          isWebhook: true,
        });
        console.log('[포트원 웹훅] 결제 완료 처리 완료');
        return createResponse(HTTP_STATUS.OK, '결제 완료');

      default:
        console.log('[포트원 웹훅] 처리하지 않는 상태:', status);
        return createResponse(HTTP_STATUS.OK, '처리하지 않는 상태');
    }
  } catch (error) {
    console.error('웹훅 처리 중 오류:', error);
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
