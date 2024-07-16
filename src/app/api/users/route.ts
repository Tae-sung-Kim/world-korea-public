import { requiredIsAdmin } from '../utils/authHelper';
import connectMongo from '@/app/api/libs/database';
import User from '@/app/api/models/user';
import { HTTP_STATUS } from '@/constants/http';
import { createResponse } from '@/utils/http';
import { NextResponse } from 'next/server';

/**
 * 회원 목록 반환
 */
export async function GET() {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const users = await User.getUserList();

    return NextResponse.json(users);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
