import SaleProductModel from '../../models/sale-product.model';
import { requiredIsMe } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 상품 상세 반환
 */
export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const saleProductId = ctx.params.id;

    await connectMongo();

    if (!(await requiredIsMe())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const saleProductData = await SaleProductModel.findOne({
      _id: saleProductId,
    }).populate({
      path: 'products',
    });

    return NextResponse.json(saleProductData);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
