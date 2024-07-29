import connectMongo from '@/app/api/libs/database';
import User from '@/app/api/models/user.model';
import { createResponse } from '@/app/api/utils/http.util';
import jwtUtils from '@/app/api/utils/jwt.util';
import { comparePassword } from '@/app/api/utils/password.util';
import { HTTP_STATUS } from '@/constants/http.constant';
import { UserHasPassword } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { id, password } = await req.json();

    const userData = await User.findOne<UserHasPassword>({ loginId: id });
    if (!userData) {
      return NextResponse.json(false);
    }

    const isEqual = await comparePassword(password, userData.password);
    if (isEqual) {
      const payload = {
        id: userData.loginId,
        name: userData.name,
        isAdmin: userData.isAdmin,
      };

      const token = jwtUtils.sign(payload);

      return NextResponse.json(token);
    }

    return NextResponse.json(false);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
