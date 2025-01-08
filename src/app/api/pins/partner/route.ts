import ProductModel from '../../models/product.model';
import { getQueryParams } from '../../utils/api.utils';
import {
  getCurrentUser,
  requiredIsAdmin,
  requiredIsLoggedIn,
} from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import PinModel, { PinDB } from '@/app/api/models/pin.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 핀 목록 반환
 */
export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const userData = await getCurrentUser();
    if (!userData) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    if (!userData.isPartner) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const partnerProducts = userData.partnerProducts as string[];

    const { pageNumber, pageSize, filter, sort } = getQueryParams(req);
    const paginationResponse = await PinModel.getPartnerPinList(
      {
        pageNumber,
        pageSize,
        filter,
        sort,
      },
      {
        partnerProducts: partnerProducts.map((d) => String(d)),
      }
    );

    return NextResponse.json(paginationResponse);
  } catch (error) {
    console.error(error);
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
