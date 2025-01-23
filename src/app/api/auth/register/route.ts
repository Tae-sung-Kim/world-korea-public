import connectMongo from '@/app/api/libs/database';
import UserCategoryModel from '@/app/api/models/user-category.model';
import UserModel from '@/app/api/models/user.model';
import { hashPassword } from '@/app/api/utils/password.util';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const body = await req.json();
    const { id, password } = body;

    // ID 중복 확인
    const existingUser = await UserModel.findOne({ loginId: id });
    if (existingUser) {
      return NextResponse.json(
        { error: '이미 사용 중인 아이디입니다.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userCategoryList = await UserCategoryModel.getUserCategoryList();
    const newUser = new UserModel({
      ...body,
      loginId: id,
      password: hashedPassword,
      userCategory: userCategoryList[0]._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newUser.save();

    return NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
