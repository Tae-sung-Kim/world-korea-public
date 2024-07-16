import { requiredIsAdmin } from '../auth';
import connectMongo from '@/app/api/db/database';
import User from '@/app/api/models/user';
import authService from '@/services/authService';
import { NextResponse } from 'next/server';

/**
 * 회원 목록 반환
 */
export async function GET() {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return NextResponse.json(
        {
          message: 'Forbidden: Admin access required',
        },
        {
          status: 403,
        }
      );
    }

    const users = await User.getUserList();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      }
    );
  }
}
