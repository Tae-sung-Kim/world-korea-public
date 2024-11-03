import connectMongo from '@/app/api/libs/database';
import UserModel from '@/app/api/models/user.model';
import { UserHasPassword } from '@/definitions';
import authService from '@/services/auth.service';

export async function getAuthData(loginId?: string) {
  await connectMongo();

  let returnValue = {
    isLoggedIn: false,
    isMe: false,
    isAdmin: false,
  };

  const session = await authService.getSession();
  if (!session) {
    return returnValue;
  }

  returnValue.isMe = !loginId ? true : loginId === session.user?.id;
  returnValue.isLoggedIn = true;

  if (!loginId) {
    loginId = session.user?.id;
  }

  const userData = await UserModel.getUserByLoginId(loginId);
  if (!userData) {
    return {
      isLoggedIn: false,
      isMe: false,
      isAdmin: false,
    };
  }

  returnValue.isAdmin = userData.isAdmin;

  return returnValue;
}

export async function getCurrentUser(): Promise<UserHasPassword | null> {
  await connectMongo();

  const session = await authService.getSession();

  if (!session) {
    return null;
  }

  const userData = await UserModel.getUserHasPasswordByLoginId(session.user.id);

  return userData;
}

export async function requiredIsAdmin() {
  const authData = await getAuthData();
  return authData.isAdmin;
}

export async function requiredIsLoggedIn() {
  const authData = await getAuthData();
  return authData.isLoggedIn;
}

export async function requiredIsMe() {
  const authData = await getAuthData();
  return authData.isMe || authData.isAdmin;
}

// if (!(await requiredIsMe())) {
//   return NextResponse.json(
//     {
//       message: 'Bad Request: Invalid request method or parameters',
//     },
//     {
//       status: 400,
//     },
//   );
// }

// if (!(await requiredIsLoggedIn())) {
//   return NextResponse.json(
//     {
//       message: 'Unauthorized: Login required',
//     },
//     {
//       status: 401,
//     },
//   );
// }

// if (!(await requiredIsAdmin())) {
//   return NextResponse.json(
//     {
//       message: 'Forbidden: Admin access required',
//     },
//     {
//       status: 403,
//     },
//   );
// }
