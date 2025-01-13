import PinModel from '../../../../models/pin.model';
import { requiredIsAdmin } from '../../../../utils/auth.util';
import { createResponse } from '../../../../utils/http.util';
import connectMongo from '@/app/api/libs/database';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 핀 사용여부 반환
 */
export async function GET(
  req: NextRequest,
  ctx: { params: { number: string } }
) {
  try {
    const pinNumber = ctx.params.number;

    await connectMongo();

    // if (!(await requiredIsAdmin())) {
    //   return createResponse(HTTP_STATUS.FORBIDDEN);
    // }

    // 핀 검색
    const existingPin = await PinModel.getPinByNumber(pinNumber);
    if (!existingPin) {
      return createResponse(HTTP_STATUS.NOT_FOUND);
    }

    // 핀 사용여부 반환
    const isUsed = !!existingPin.usedDate;

    return NextResponse.json(isUsed);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
