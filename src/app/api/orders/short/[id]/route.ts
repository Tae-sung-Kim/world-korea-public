import SaleProductModel from '../../../models/sale-product.model';
import { requiredIsMe } from '../../../utils/auth.util';
import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import connectMongo from '@/app/api/libs/database';
import OrderModel from '@/app/api/models/order.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import authService from '@/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 주문 _id 반환
 */
export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const shortId = ctx.params.id;

    await connectMongo();

    const orderData = await OrderModel.getOrderByShortId(shortId);

    if (!orderData) {
      return createResponse(HTTP_STATUS.NOT_FOUND);
    }

    return NextResponse.json(orderData._id);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
