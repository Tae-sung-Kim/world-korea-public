import connectMongo from '@/app/api/libs/database';
import SaleProductModel from '@/app/api/models/sale-product.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/sale-products/reservable:
 *    get:
 *      tags:
 *        - SaleProducts
 *      description: 예약 가능한 판매상품 목록을 반환한다.
 *      responses:
 *        200:
 *          description: OK
 */
export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const list = await SaleProductModel.getReservableSaleProductList();

    return NextResponse.json(list, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, no-cache, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'X-Request-Timestamp': Date.now().toString(),
      },
    });
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
