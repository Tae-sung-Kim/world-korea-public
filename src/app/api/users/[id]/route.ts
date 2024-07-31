import { requiredIsMe } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import User from '@/app/api/models/user.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions/http.constant';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 회원 정보 반환
 */
export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const userId = ctx.params.id;

    await connectMongo();

    if (!(await requiredIsMe())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const userData = await User.getUserById(userId);

    return NextResponse.json(userData);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 회원 정보 수정
 */
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const userId = ctx.params.id;
    const body = await req.json();

    await connectMongo();

    if (!(await requiredIsMe())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(false);
    }

    await existingUser.updateUser(body);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
