import { getQueryParams } from '../utils/api.utils';
import { getCurrentUser } from '../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import GroupReservationModel from '@/app/api/models/group-reservation.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS, USER_CATEGORY_LEVEL_ADMIN } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 그룹예약 목록 반환
 */
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectMongo();

    const { pageNumber, pageSize } = getQueryParams(req);

    // const list = await GroupReservationModel.find({});

    const paginationResponse =
      await GroupReservationModel.getGroupReservationList({
        pageNumber,
        pageSize,
      });

    return NextResponse.json(paginationResponse);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 그룹예약 등록
 */
export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const body = await req.json();
    let { customData, usedAt } = body;

    if (!customData || !usedAt) {
      return createResponse(HTTP_STATUS.BAD_REQUEST);
    }

    const newGroupReservation = new GroupReservationModel({
      customData,
      usedAt,
    });

    await newGroupReservation.save();

    return NextResponse.json(newGroupReservation);
  } catch (error: any) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
