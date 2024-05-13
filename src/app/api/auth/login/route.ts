import connectMongo from '@/db/database';
import User, { UserSchemaType } from '@/models/user';
import jwtUtils from '@/utils/jwt';
import { comparePassword } from '@/utils/password';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id, password } = await req.json();

    const userData = await User.findOne<UserSchemaType>({ loginId: id });

    if (!userData) {
      return NextResponse.json(false);
    }

    const isEqual = await comparePassword(password, userData.password);
    if (isEqual) {
      const payload = {
        id: userData.loginId,
        name: userData.name,
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
