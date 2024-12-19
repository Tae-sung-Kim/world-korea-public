import { requiredIsAdmin } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import GroupReservationModel from '@/app/api/models/group-reservation.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 그룹예약 상세 반환
 */
export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const groupReservationId = ctx.params.id;

    await connectMongo();

    const groupReservationData = await GroupReservationModel.findById(
      groupReservationId
    );

    return NextResponse.json(groupReservationData);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 그룹예약 수정
 */
// export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    const { customData, usedAt } = await req.json();

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    await GroupReservationModel.findByIdAndUpdate(id, {
      customData,
      usedAt,
    });

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 그룹예약 삭제
 */
export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const id = ctx.params.id;
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    await GroupReservationModel.findByIdAndDelete(id);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
