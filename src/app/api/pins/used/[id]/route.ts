import PinModel from '../../../models/pin.model';
import { requiredIsAdmin } from '../../../utils/auth.util';
import { createResponse } from '../../../utils/http.util';
import connectMongo from '@/app/api/libs/database';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 핀 사용날짜 변경 (핀 목록)
 */
export async function POST(req: NextRequest) {
  try {
    const { pinList, used = true } = await req.json();

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const existingProduct = await PinModel.updateUsedDatePinList(pinList, used);
    if (!existingProduct) {
      return NextResponse.json(false);
    }

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 핀 사용날짜 변경 (핀 단일)
 */
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const pinId = ctx.params.id;
    const { used } = await req.json();

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const existingProduct = await PinModel.updateUsedDatePin(pinId, used);
    if (!existingProduct) {
      return NextResponse.json(false);
    }

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
