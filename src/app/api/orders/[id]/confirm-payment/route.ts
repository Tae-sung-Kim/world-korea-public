import OrderModel from '../../../models/order.model';
import PinModel from '../../../models/pin.model';
import { requiredIsMe } from '../../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS, OrderStatus } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 주문 상세 반환
 */
export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const orderId = ctx.params.id;
    const { paymentId, isWebhook }: { paymentId: string; isWebhook?: boolean } =
      await req.json();

    await connectMongo();

    // 웹훅 요청 검증 또는 일반 인증 체크
    if (isWebhook) {
      // 내부 API 토큰 검증
      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      if (token !== process.env.INTERNAL_API_TOKEN) {
        console.error('Invalid internal token');
        return createResponse(
          HTTP_STATUS.UNAUTHORIZED,
          '유효하지 않은 웹훅 요청'
        );
      }
    } else if (!(await requiredIsMe())) {
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

    if (orderData.status === OrderStatus.Completed) {
      return createResponse(
        HTTP_STATUS.BAD_REQUEST,
        '이미 결제완료된 주문 건 입니다.'
      );
    }

    if (orderData.status !== OrderStatus.Pending) {
      return createResponse(
        HTTP_STATUS.BAD_REQUEST,
        '결제대기 상태가 아닙니다.'
      );
    }

    if (!Array.isArray(orderData.tickets) || orderData.tickets.length < 1) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, '티켓이 없습니다.');
    }

    const pinIds = orderData.tickets.map((ticket) => ticket.pins).flat();
    for (let pinNumber of pinIds) {
      await PinModel.updateOne(
        { _id: pinNumber },
        {
          $set: {
            orderStatus: OrderStatus.Completed,
          },
        },
        {
          runValidators: true,
        }
      );
    }

    orderData.status = OrderStatus.Completed;
    orderData.paymentId = paymentId;
    await orderData.save();

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
