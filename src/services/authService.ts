import http from '@/services';
import { SingInUserType, SignUpUserType, UserType } from '@/types/user';

class AuthService {
  // 회원가입
  signUp(user: SignUpUserType) {
    return http.post<UserType>(`/api/auth/signup`, user);
  }

  // 로그인
  signIn(user: SingInUserType) {
    return http.post<boolean>(`/api/auth/signin`, user);
  }
}

export default new AuthService();
