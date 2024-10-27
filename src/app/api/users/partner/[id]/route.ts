import { requiredIsAdmin, requiredIsMe } from '../../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import UserModel from '@/app/api/models/user.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions/http.constant';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 파트너 정보 반환
 */
export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const userId = ctx.params.id;

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const userData = await UserModel.getUserById(userId);

    return NextResponse.json(userData);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 파트너 상품 수정
 */
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const userId = ctx.params.id;
    const { partnerProducts }: { partnerProducts: string[] } = await req.json();

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return createResponse(HTTP_STATUS.NOT_FOUND);
    }

    await existingUser.updateUserPartnerProduct(partnerProducts);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
