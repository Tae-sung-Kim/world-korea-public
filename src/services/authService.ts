import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import http from '@/services';
import {
  SingInUserType,
  SignUpUserType,
  UserType,
  SignInReturnType,
} from '@/types/user';
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
  getSession() {
    return typeof window === 'undefined'
      ? getServerSession(authOptions)
      : getSession();
  }
}

export default new AuthService();
