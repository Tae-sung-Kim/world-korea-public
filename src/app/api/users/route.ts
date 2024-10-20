import { requiredIsAdmin } from '../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import UserModel from '@/app/api/models/user.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions/http.constant';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/users:
 *    get:
 *      description: 회원 목록을 반환한다.
 *      responses:
 *        200:
 *          description: OK
 */
export async function GET() {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const users = await UserModel.getUserList();

    return NextResponse.json(users);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
