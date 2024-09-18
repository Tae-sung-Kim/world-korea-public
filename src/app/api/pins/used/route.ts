import PinModel from '../../models/pin.model';
import { requiredIsAdmin } from '../../utils/auth.util';
import { createResponse } from '../../utils/http.util';
import connectMongo from '@/app/api/libs/database';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 핀 사용날짜 변경 (핀 목록)
 */
export async function POST(req: NextRequest) {
  try {
    const { pinNumberList, used = true } = await req.json();

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    await PinModel.updateUsedDatePinNumberList(pinNumberList, used);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
