import connectMongo from '@/app/api/libs/database';
import OrderModel from '@/app/api/models/order.model';
import { createResponse } from '@/app/api/utils/http.util';
import { OrderStatus, HTTP_STATUS } from '@/definitions';
import { NextRequest } from 'next/server';

/**
 * 가상계좌 발급 처리
 */
export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const orderId = ctx.params.id;
    const { merchantId }: { merchantId: string } = await req.json();

    await connectMongo();

    if (!merchantId) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, 'merchantId가 없습니다.');
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
        '결제대기 상태가 아닙니다.'
      );
    }

    await OrderModel.updateOne(
      { _id: orderId },
      {
        $set: {
          merchantId,
          status: OrderStatus.VbankReady,
        },
      }
    );

    return createResponse(HTTP_STATUS.OK);
  } catch (error) {
    console.error('가상계좌 발급 처리 중 오류 발생:', error);
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
