import OrderModel from '../../../models/order.model';
import PinModel from '../../../models/pin.model';
import { requiredIsMe } from '../../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS, OrderStatus } from '@/definitions';
import { NextRequest } from 'next/server';

/**
 * 주문 취소 처리
 */
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const orderId = ctx.params.id;

    await connectMongo();

    if (!(await requiredIsMe())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const orderData = await OrderModel.findOne({
      _id: orderId,
    });

    if (!orderData) {
      return createResponse(HTTP_STATUS.NOT_FOUND);
    }

    if (orderData.status !== OrderStatus.Pending) {
      return createResponse(
        HTTP_STATUS.BAD_REQUEST,
        '결제 대기 상태가 아닙니다.'
      );
    }

    if (!Array.isArray(orderData.tickets) || orderData.tickets.length < 1) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, '티켓이 없습니다.');
    }

    // 주문 상태 업데이트
    await OrderModel.updateOne({ _id: orderId }, { $set: { status: null } });

    // PIN 상태 업데이트
    const pinIds = orderData.tickets.map((ticket) => ticket.pins).flat();
    for (let pinNumber of pinIds) {
      await PinModel.updateOne(
        { _id: pinNumber },
        {
          $set: {
            orderStatus: null,
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
    console.error('취소 처리 중 오류:', error);
    return createResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message || '취소 처리 중 오류가 발생했습니다.'
    );
  }
}
