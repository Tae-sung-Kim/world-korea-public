import OrderModel from '../../models/order.model';
import { getQueryParams } from '../../utils/api.utils';
import { getCurrentUser } from '../../utils/auth.util';
import { createResponse } from '../../utils/http.util';
import connectMongo from '@/app/api/libs/database';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 주문 목록 반환 (나의)
 */
export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    // 파트너 구매 목록 제외
    // const userData = await getCurrentUser();
    // if (!userData) {
    //   return createResponse(HTTP_STATUS.UNAUTHORIZED);
    // }

    // const { pageNumber, pageSize, filter, sort } = getQueryParams(req);
    // const paginationResponse = await OrderModel.getPartnerOrderList(
    //   {
    //     pageNumber,
    //     pageSize,
    //     filter,
    //     sort,
    //   },
    //   userData._id
    // );

    // return NextResponse.json(paginationResponse);
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
