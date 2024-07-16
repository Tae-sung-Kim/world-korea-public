import connectMongo from '@/app/api/db/database';
import User, { IUser } from '@/app/api/models/user';
import jwtUtils from '@/utils/jwt';
import { comparePassword } from '@/utils/password';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { id, password } = await req.json();

    const userData = await User.findOne<IUser>({ loginId: id });
    if (!userData) {
      return NextResponse.json(false);
    }

    const isEqual = await comparePassword(password, userData.password);
    if (isEqual) {
      const payload = {
        id: userData.loginId,
        name: userData.name,
        isAdmin: userData.isAdmin,
      };

      const token = jwtUtils.sign(payload);

      return NextResponse.json(token);
    }

    return NextResponse.json(false);
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
