import connectMongo from '@/db/database';
import User from '@/models/user';
import { hashPassword } from '@/utils/password';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const body = await req.json();
    const { id, password } = body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      ...body,
      loginId: id,
      password: hashedPassword,
      isAdmin: false,
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
