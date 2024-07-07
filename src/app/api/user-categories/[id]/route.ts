import { requiredIsAdmin } from '../../auth';
import connectMongo from '@/db/database';
import UserCategory from '@/models/userCategory';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 회원 구분 수정
 */
export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    const { name, level } = await req.json();

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return NextResponse.json(
        {
          message: 'Forbidden: Admin access required',
        },
        {
          status: 403,
        },
      );
    }

    await UserCategory.findByIdAndUpdate(id, {
      name,
      level,
    });

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

/**
 * 회원 구분 삭제
 */
export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } },
) {
  try {
    const id = ctx.params.id;
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return NextResponse.json(
        {
          message: 'Forbidden: Admin access required',
        },
        {
          status: 403,
        },
      );
    }

    await UserCategory.findByIdAndDelete(id);

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
