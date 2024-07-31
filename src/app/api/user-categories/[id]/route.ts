import { requiredIsAdmin } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import UserCategory from '@/app/api/models/user-category.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 회원 구분 수정
 */
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    const { name, level } = await req.json();

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    await UserCategory.findByIdAndUpdate(id, {
      name,
      level,
    });

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 회원 구분 삭제
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

    await UserCategory.findByIdAndDelete(id);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
