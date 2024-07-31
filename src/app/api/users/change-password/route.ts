import User from '../../models/user.model';
import { getCurrentUser, requiredIsLoggedIn } from '../../utils/auth.util';
import { comparePassword, hashPassword } from '../../utils/password.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    await connectMongo();

    const userData = await getCurrentUser();
    if (!userData) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const isEqual = await comparePassword(currentPassword, userData.password);
    if (!isEqual) {
      return NextResponse.json(false);
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.updateUserPasswordById(userData._id, hashedPassword);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
