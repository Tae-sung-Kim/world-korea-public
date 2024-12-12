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

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-portone-signature': process.env.PORTONE_API_SECRET || '', // 웹훅 검증을 위한 시그니처 추가
      Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
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

  return response;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[포트원 웹훅] 요청 body:', JSON.stringify(body, null, 2));

    const { imp_uid, merchant_uid, status } = body;

    if (!imp_uid || !merchant_uid || !status) {
      console.error(
        '[포트원 웹훅] 필수 파라미터 누락:',
        JSON.stringify(body, null, 2)
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
      await new Promise(resolve => setTimeout(resolve, 1000));
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
        // 입금 완료 처리
        console.log('[포트원 웹훅] 결제 완료 처리 시작');
        console.log('[포트원 웹훅] 현재 주문 상태:', {
          orderId: order._id,
          status: order.status,
          expectedStatus: OrderStatus.VbankReady,
        });

        // VbankReady 상태인 경우에만 처리
        if (order.status !== OrderStatus.VbankReady) {
          console.log('[포트원 웹훅] 처리할 수 없는 주문 상태:', order.status);
          return createResponse(HTTP_STATUS.OK, '처리할 수 없는 주문 상태');
        }

        await callOrderAPI(order._id, 'confirm-payment', 'POST', {
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
