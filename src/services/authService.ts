import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
  signUp(user: SignUpUserType) {
    return http.post<UserType>(`/api/auth/signup`, user);
  }

  // 로그인
  signIn(user: SingInUserType) {
    return http.post<SignInReturnType>(`/api/auth/signin`, user);
  }

  // 세션 반환
  getSession() {
    return typeof window === 'undefined'
      ? getServerSession(authOptions)
      : getSession();
  }
}

export default new AuthService();
