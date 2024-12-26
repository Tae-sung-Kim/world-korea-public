import OrderModel from '../../../models/order.model';
import PinModel from '../../../models/pin.model';
import { requiredIsMe } from '../../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS, OrderPayType, OrderStatus } from '@/definitions';
import axios from 'axios';
import { NextRequest } from 'next/server';

// 포트원 액세스 토큰 발급
async function getPortoneAccessToken() {
  try {
    const response = await axios.post(
      `${process.env.PORT_ONE_API_URL}/users/getToken`,
      {
        imp_key: process.env.PORTONE_API_KEY,
        imp_secret: process.env.PORTONE_SECRET_API,
      }
    );
    return response.data.response.access_token;
  } catch (error) {
    console.error('포트원 Access Token 발급 실패:', error);
    throw new Error('포트원 인증 실패');
  }
}

// 포트원 환불 요청
async function requestRefund(accessToken: string, paymentId: string) {
  try {
    const response = await axios.post(
      `${process.env.PORT_ONE_API_URL}/payments/cancel`,
      {
        imp_uid: paymentId,
        reason: '고객 환불 요청',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.response;
  } catch (error: any) {
    console.error('환불 요청 실패:', error.response?.data || error);
    throw new Error(
      error.response?.data?.message || '환불 요청 중 오류가 발생했습니다.'
    );
  }
}

/**
 * 주문 환불 처리
 */
export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const orderId = ctx.params.id;
    const { paymentId, payType }: { paymentId: string; payType: string } =
      await req.json();

    await connectMongo();

    if (!(await requiredIsMe())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    if (!paymentId) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, 'paymentId 가 없습니다.');
    }

    const orderData = await OrderModel.findOne({
      _id: orderId,
    });

    if (!orderData) {
      return createResponse(HTTP_STATUS.NOT_FOUND);
    }

    if (orderData.status === OrderStatus.Refunded) {
      return createResponse(
        HTTP_STATUS.BAD_REQUEST,
        '이미 결제 취소한 주문 건 입니다.'
      );
    }

    if (orderData.status !== OrderStatus.Completed) {
      return createResponse(
        HTTP_STATUS.BAD_REQUEST,
        '결제완료 상태가 아닙니다.'
      );
    }

    if (!Array.isArray(orderData.tickets) || orderData.tickets.length < 1) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, '티켓이 없습니다.');
    }

    if (payType !== OrderPayType.Trans) {
      // 포트원 환불 처리
      const accessToken = await getPortoneAccessToken();
      await requestRefund(accessToken, paymentId);
    }

    // 주문 상태 업데이트
    await OrderModel.updateOne(
      { _id: orderId },
      { $set: { status: OrderStatus.Refunded } }
    );

    // PIN 상태 업데이트
    const pinIds = orderData.tickets.map((ticket) => ticket.pins).flat();
    for (let pinNumber of pinIds) {
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
        }
      );
    }

    return createResponse(HTTP_STATUS.OK);
  } catch (error: any) {
    console.error('환불 처리 중 오류:', error);
    return createResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message || '환불 처리 중 오류가 발생했습니다.'
    );
  }
}
