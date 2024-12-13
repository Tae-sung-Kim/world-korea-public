import connectMongo from '@/app/api/libs/database';
import OrderModel from '@/app/api/models/order.model';
import { createResponse } from '@/app/api/utils/http.util';
import { OrderStatus, HTTP_STATUS } from '@/definitions';
import { NextRequest } from 'next/server';

/**
 * 가상계좌 발급 처리
 */
export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  let session = null;
  try {
    const orderId = ctx.params.id;
    const {
      merchantId,
      vbankName,
      vbankNum,
    }: { merchantId: string; vbankName: string; vbankNum: string } =
      await req.json();

    if (!merchantId) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, 'merchantId가 없습니다.');
    }

    // MongoDB 연결
    const mongoose = await connectMongo();
    session = await mongoose.startSession();
    session.startTransaction();

    const orderData = await OrderModel.findOne({
      _id: orderId,
    }).session(session);

    if (!orderData) {
      await session.abortTransaction();
      return createResponse(HTTP_STATUS.NOT_FOUND);
    }

    // 상태 체크 수정: Unpaid나 Pending 상태일 때만 처리 가능
    if (![OrderStatus.Unpaid, OrderStatus.Pending].includes(orderData.status)) {
      await session.abortTransaction();
      return createResponse(
        HTTP_STATUS.BAD_REQUEST,
        '처리할 수 없는 주문 상태입니다.'
      );
    }

    await OrderModel.updateOne(
      { _id: orderId },
      {
        $set: {
          merchantId,
          status: OrderStatus.VbankReady,
          vbankName,
          vbankNum,
          updatedAt: new Date()
        },
      },
      { session }
    );

    await session.commitTransaction();
    return createResponse(HTTP_STATUS.OK);
  } catch (error) {
    console.error('가상계좌 발급 처리 중 오류 발생:', error);
    if (session) {
      await session.abortTransaction();
    }
    return createResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      '가상계좌 발급 처리 중 오류가 발생했습니다.'
    );
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}
