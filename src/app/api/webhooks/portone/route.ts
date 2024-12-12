import OrderModel from '@/app/api/models/order.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
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
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}/${endpoint}`;
  console.log('[포트원 웹훅] API 호출 시작:', {
    url,
    method,
    body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
    },
  });

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
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
  } catch (error) {
    console.error('[포트원 웹훅] API 호출 중 에러:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[포트원 웹훅] 요청 body:', JSON.stringify(body, null, 2));
    console.log('[포트원 웹훅] 환경변수 확인:', {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      hasInternalToken: !!process.env.INTERNAL_API_TOKEN,
    });

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

    console.log('[포트원 웹훅] 주문 조회 시작:', { merchant_uid });
    // merchant_uid로 주문 조회
    const order = await OrderModel.findOne({
      $or: [
        { merchantId: merchant_uid }, // 기존 필드명으로 찾기
        { merchant_uid: merchant_uid }, // 포트원에서 보내는 필드명으로도 찾기
      ],
    });

    if (!order) {
      console.error('[포트원 웹훅] 주문을 찾을 수 없음:', merchant_uid);
      return createResponse(HTTP_STATUS.NOT_FOUND, '주문을 찾을 수 없습니다.');
    }

    console.log('[포트원 웹훅] 주문 찾음:', {
      orderId: order._id,
      status: order.status,
      merchantId: order.merchantId,
    });

    switch (status) {
      case 'ready':
        // 가상계좌 발급 완료
        console.log('[포트원 웹훅] 가상계좌 발급 완료 처리 시작');
        await callOrderAPI(order._id, 'vbank-confirm-payment', 'POST', {
          merchantId: merchant_uid,
        });
        console.log('[포트원 웹훅] 가상계좌 발급 완료 처리 완료');
        return createResponse(HTTP_STATUS.OK, '가상계좌 발급 완료');

      case 'paid':
        // 입금 완료 처리
        console.log('[포트원 웹훅] 입금 완료 처리 시작:', {
          orderId: order._id,
          imp_uid,
          merchant_uid,
          status,
        });
        try {
          await callOrderAPI(order._id, 'confirm-payment', 'POST', {
            paymentId: imp_uid,
            merchantId: merchant_uid,
            status: 'paid',
          });
          console.log('[포트원 웹훅] 입금 완료 처리 성공');
          return createResponse(HTTP_STATUS.OK, '결제 완료 처리됨');
        } catch (error) {
          console.error('[포트원 웹훅] 입금 완료 처리 실패:', error);
          throw error;
        }

      case 'cancelled':
        console.log('[포트원 웹훅] 결제 취소 처리 시작:', {
          orderId: order._id,
          imp_uid,
          merchant_uid,
          status,
        });
        try {
          await callOrderAPI(order._id, 'cancel', 'PATCH');
          console.log('[포트원 웹훅] 결제 취소 처리 성공');
        } catch (error) {
          console.error('[포트원 웹훅] 결제 취소 처리 실패:', error);
          throw error;
        }
        break;

      case 'failed':
        console.log('[포트원 웹훅] 결제 실패 처리 시작:', {
          orderId: order._id,
          imp_uid,
          merchant_uid,
          status,
        });
        try {
          await callOrderAPI(order._id, 'cancel', 'PATCH');
          console.log('[포트원 웹훅] 결제 실패 처리 성공');
        } catch (error) {
          console.error('[포트원 웹훅] 결제 실패 처리 실패:', error);
          throw error;
        }
        break;

      default:
        console.log('알 수 없는 결제 상태:', status);
    }

    return createResponse(HTTP_STATUS.OK);
  } catch (error) {
    console.error('웹훅 처리 중 오류:', error);
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
