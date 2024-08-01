import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import { User, SignInReturnType } from '@/definitions';
import http from '@/services';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';

export type UserSignIn = {
  id: string;
  password: string;
};

export type UserSignUp = UserSignIn & {
  email: string;
  name: string;
};

class AuthService {
  // 회원가입
  register(user: UserSignUp) {
    return http.post<User>(`/api/auth/register`, user);
  }

  // 로그인
  login(user: UserSignIn) {
    return http.post<SignInReturnType>(`/api/auth/login`, user);
  }

  // 세션 반환
  async getSession() {
    return typeof window === 'undefined'
      ? getServerSession(authOptions)
      : getSession();
  }

  async getUserAuth(loginId?: string): Promise<{
    user: { id: string; name: string };
    accessToken: string;
  } | null> {
    return http.get(`/api/auth/user?loginId=${loginId || ''}`);
  }
}

const authService = new AuthService();

export default authService;
