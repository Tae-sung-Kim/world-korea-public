import connectMongo from '@/db/database';
import User from '@/models/user';
import authService from '@/services/authService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectMongo();

    const session = await authService.getSession();
    if (!session) {
      return NextResponse.json(
        { message: '권한이 없습니다.' },
        { status: 400 }
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
