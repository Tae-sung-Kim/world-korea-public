import { requiredIsLoggedIn } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    await connectMongo();

    if (!(await requiredIsLoggedIn())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
