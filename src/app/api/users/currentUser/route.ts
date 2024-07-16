import { requiredIsAdmin, requiredIsMe } from '../../auth';
import connectMongo from '@/app/api/db/database';
import User from '@/app/api/models/user';
import { HTTP_STATUS } from '@/constants/http';
import authService from '@/services/authService';
import { createResponse } from '@/utils/http';
import { NextResponse } from 'next/server';

/**
 * 회원 정보 반환
 */
export async function GET() {
  try {
    await connectMongo();

    const session = await authService.getSession();

    if (!session) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const userData = await User.getUserByLoginId(session.user.id);

    return NextResponse.json(userData);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
