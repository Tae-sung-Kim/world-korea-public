import connectMongo from '@/app/api/libs/database';
import UserModel from '@/app/api/models/user.model';
import authService from '@/services/auth.service';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: any) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  let loginId = searchParams.get('loginId');

  try {
    await connectMongo();

    let returnValue = {
      isLoggedIn: false,
      isMe: false,
      isAdmin: false,
    };

    const session = await authService.getSession();

    if (!session) {
      return NextResponse.json(returnValue);
    }
    returnValue.isMe = !loginId ? true : loginId === session.user?.id;
    returnValue.isLoggedIn = true;

    if (!loginId) {
      loginId = session.user?.id;
    }

    const userData = await UserModel.getUserByLoginId(loginId);
    if (!userData) {
      return NextResponse.json({
        isLoggedIn: false,
        isMe: false,
        isAdmin: false,
      });
    }

    returnValue.isAdmin = userData.isAdmin;

    return NextResponse.json(returnValue);
  } catch (error) {
    return NextResponse.json({
      isLoggedIn: false,
      isMe: false,
      isAdmin: false,
    });
  }
}
