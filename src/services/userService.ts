import http from '@/services';
import { UserListType } from '@/types/user';

class UserService {
  // 회원 반환
  getUserById(id: string) {
    return http.get<UserListType>(`/api/users/${id}`);
  }

  // 회원 목록 반환
  getUserList() {
    return http.get<UserListType>(`/api/users`);
  }

  // 회원 수정
  updateUser() {
    return http.put<UserListType>(`/api/users`);
  }

  // 회원 삭제
  deleteUser() {
    return http.delete<UserListType>(`/api/users`);
  }
}

export default new UserService();
