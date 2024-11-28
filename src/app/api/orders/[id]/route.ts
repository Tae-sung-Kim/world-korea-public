import OrderModel from '../../models/order.model';
import { requiredIsMe } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 주문 상세 반환
 */
export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const orderId = ctx.params.id;

    await connectMongo();

    if (!(await requiredIsMe())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const orderData = await OrderModel.findOne({
      _id: orderId,
    }).populate({
      path: 'sale-products',
    });

    return NextResponse.json(orderData);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
