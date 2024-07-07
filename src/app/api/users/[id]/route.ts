import { requiredIsAdmin, requiredIsMe } from '../../auth';
import connectMongo from '@/db/database';
import User from '@/models/user';
import authService from '@/services/authService';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 회원 정보 반환
 */
export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const userId = ctx.params.id;

    await connectMongo();

    if (!(await requiredIsMe())) {
      return NextResponse.json(
        {
          message: 'Bad Request: Invalid request method or parameters',
        },
        {
          status: 400,
        },
      );
    }

    const userData = await User.getUserById(userId);

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * 회원 정보 수정
 */
export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const userId = ctx.params.id;
    const body = await req.json();

    await connectMongo();

    if (!(await requiredIsMe())) {
      return NextResponse.json(
        {
          message: 'Bad Request: Invalid request method or parameters',
        },
        {
          status: 400,
        },
      );
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(false);
    }

    await existingUser.updateUser(body);

    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      },
    );
  }
}
