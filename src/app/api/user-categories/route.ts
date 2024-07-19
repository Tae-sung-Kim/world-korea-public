import { requiredIsAdmin } from '../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import UserCategory from '@/app/api/models/user-category.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 회원 구분 목록 반환
 */
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectMongo();

    const list = await UserCategory.getUserCategoryList();

    return NextResponse.json(list);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 회원 구분 등록
 */
export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const body = await req.json();
    const { name, level } = body;

    if (!name || name.trim() === '' || typeof level !== 'number') {
      return NextResponse.json(
        { message: '값을 정확하게 입력하세요.' },
        { status: 400 }
      );
    }

    const newUserCategory = new UserCategory({
      name,
      level,
    });

    await newUserCategory.save();

    return NextResponse.json(newUserCategory, { status: 200 });
  } catch (error: any) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
