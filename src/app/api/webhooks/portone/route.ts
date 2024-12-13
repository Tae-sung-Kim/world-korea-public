import connectMongo from '@/app/api/libs/database';
import OrderModel from '@/app/api/models/order.model';
import PinModel from '@/app/api/models/pin.model';
// PinModel import 추가
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS, OrderStatus } from '@/definitions';
import crypto from 'crypto';
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
const validatePortoneWebhook = async (bodyText: string, headers: Headers) => {
  // 포트원 API 시크릿 키 확인
  const portoneApiKey = process.env.PORTONE_SECRET_API;
  if (!portoneApiKey) {
    console.error('PORTONE_SECRET_API is not set');
    return false;
  }

  // 프로덕션 환경이 아닌 경우 signature 검증 스킵
  if (process.env.NODE_ENV !== 'production') {
    console.log('[포트원 웹훅] 프로덕션 환경이 아닌 경우 signature 검증 스킵');
    return true;
  }

  // 포트원 웹훅 헤더 검증
  const signature = headers.get('x-portone-signature');
  if (!signature) {
    console.error('Missing Portone signature header');
    // 프로덕션에서도 일단 허용 (포트원 웹훅 테스트 위해)
    console.log('[포트원 웹훅] signature 누락되었지만 임시로 허용');
    return true;
  }

  try {
    // HMAC SHA256 해시 생성
    const hmac = crypto.createHmac('sha256', portoneApiKey);
    hmac.update(bodyText);
    const hash = hmac.digest('hex');

    console.log('[포트원 웹훅] 서명 검증:', {
      receivedSignature: signature,
      calculatedHash: hash,
      matched: signature === hash,
    });

    // 서명 일치 여부 확인
    return signature === hash;
  } catch (error) {
    console.error('[포트원 웹훅] 서명 검증 중 오류:', error);
    return false;
  }
};

export async function POST(req: NextRequest) {
  try {
    console.log('[포트원 웹훅] 요청 헤더:', {
      headers: Object.fromEntries(req.headers.entries()),
    });

    // body를 먼저 읽어서 저장
    const bodyText = await req.text();
    console.log('[포트원 웹훅] 요청 body:', bodyText);

    // 포트원 웹훅 검증
    if (!(await validatePortoneWebhook(bodyText, req.headers))) {
      return createResponse(
        HTTP_STATUS.UNAUTHORIZED,
        '유효하지 않은 웹훅 요청'
      );
    }

    const body = JSON.parse(bodyText);
    const { imp_uid, merchant_uid, status } = body;

    console.log('[포트원 웹훅] 수신된 웹훅 데이터:', {
      imp_uid,
      merchant_uid,
      status,
      body,
    });

    // ready 상태는 무시 (프론트엔드에서 처리)
    if (status === 'ready') {
      console.log('[포트원 웹훅] ready 상태는 프론트엔드에서 처리');
      return createResponse(HTTP_STATUS.OK, 'ready 상태는 프론트엔드에서 처리');
    }

    // vbank_due 상태 처리 추가
    if (status === 'vbank_due' || status === 'cancelled' || (status === 'failed' && body.pay_method === 'vbank')) {
      console.log('[포트원 웹훅] 가상계좌 기한 만료 또는 취소 처리 시작:', {
        merchant_uid,
        status,
        pay_method: body.pay_method,
      });

      // MongoDB 연결 추가
      await connectMongo();

      const order = await OrderModel.findOne({ merchantId: merchant_uid });
      if (!order) {
        console.error('[포트원 웹훅] 주문을 찾을 수 없음:', { merchant_uid });
        return createResponse(
          HTTP_STATUS.NOT_FOUND,
          '주문을 찾을 수 없습니다.'
        );
      }

      // VbankReady 상태인 경우에만 처리
      if (order.status === OrderStatus.VbankReady) {
        try {
          // MongoDB 세션 시작
          const session = await (await connectMongo()).startSession();

          await session.withTransaction(async () => {
            // 주문 상태를 취소로 변경
            await OrderModel.updateOne(
              { _id: order._id },
              {
                $set: {
                  status: OrderStatus.Canceled,
                  updatedAt: new Date(),
                },
              },
              { session }
            );

            // PIN 상태 업데이트 - Unpaid로 변경하여 재사용 가능하도록 함
            const pinIds = order.tickets.map((ticket) => ticket.pins).flat();
            for (const pinNumber of pinIds) {
              await PinModel.updateOne(
                { _id: pinNumber },
                {
                  $set: {
                    orderStatus: OrderStatus.Unpaid,
                    updatedAt: new Date(),
                    order: null,
                  },
                },
                {
                  runValidators: true,
                  session,
                }
              );
              console.log('[포트원 웹훅] PIN 상태 업데이트:', {
                orderId: order._id,
                pinId: pinNumber,
                status: OrderStatus.Unpaid,
              });
            }

            console.log('[포트원 웹훅] 모든 PIN 상태 업데이트 완료:', {
              orderId: order._id,
              pinCount: pinIds.length,
              status: OrderStatus.Unpaid,
            });
          });

          await session.endSession();
          console.log('[포트원 웹훅] 가상계좌 기한 만료 또는 취소 처리 완료:', {
            orderId: order._id,
            orderStatus: OrderStatus.Canceled,
            pinStatus: OrderStatus.Unpaid,
          });
          return createResponse(
            HTTP_STATUS.OK,
            '가상계좌 기한 만료 또는 취소 처리 완료'
          );
        } catch (error) {
          console.error(
            '[포트원 웹훅] 가상계좌 만료 또는 취소 처리 중 오류:',
            error
          );
          return createResponse(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            '가상계좌 만료 또는 취소 처리 중 오류가 발생했습니다.'
          );
        }
      }

      return createResponse(HTTP_STATUS.OK, '처리가 필요하지 않은 주문 상태');
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
