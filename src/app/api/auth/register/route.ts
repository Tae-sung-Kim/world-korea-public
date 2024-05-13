import connectMongo from '@/db/database';
import User from '@/models/user';
import { hashPassword } from '@/utils/password';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { id, email, password, name } = await req.json();
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      loginId: id,
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      {
        id,
        email,
        name,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
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
