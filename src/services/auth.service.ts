import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import http from '@/services';
import {
  SingInUserType,
  SignUpUserType,
  UserType,
  SignInReturnType,
  UserAuth,
} from '@/types';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';

class AuthService {
  // 회원가입
  register(user: SignUpUserType) {
    return http.post<UserType>(`/api/auth/register`, user);
  }

  // 로그인
  login(user: SingInUserType) {
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
  // getUserAuth(loginId?: string) {
  //   return http.get<UserAuth>(`/api/auth/user?loginId=${loginId || ''}`);
  // }
}

export default new AuthService();
