import { requiredIsAdmin } from '../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import UserCategoryModel from '@/app/api/models/user-category.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 회원 구분 목록 반환
 */
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectMongo();

    const list = await UserCategoryModel.getUserCategoryList();

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
    let { name, level } = body;

    if (!name || name.trim() === '' || typeof level !== 'number') {
      return createResponse(HTTP_STATUS.BAD_REQUEST);
    }

    const newUserCategory = new UserCategoryModel({
      name,
      level,
    });

    await newUserCategory.save();

    return NextResponse.json(newUserCategory);
  } catch (error: any) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
