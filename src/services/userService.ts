import http from '@/services';
import { UserListType, UserType } from '@/types/user';

class UserService {
  // 유저 반환
  getUserById(id: string) {
    return http.get<UserType>(`/api/users/${id}`);
  }

  // 유저 목록 반환
  getUserList() {
    return http.get<UserListType>(`/api/users`);
  }

  // 유저 수정 (관리자)
  updateUser(
    userData: Pick<
      UserType,
      | '_id'
      | 'companyName'
      | 'companyNo'
      | 'address'
      | 'contactNumber'
      | 'name'
      | 'phoneNumber'
      | 'email'
      | 'isApproved'
    > & { userCategoryId: string }
  ) {
    return http.patch<UserType>(`/api/users/${userData._id}`, userData);
  }

  // 유저 삭제
  deleteUser() {
    return http.delete<UserListType>(`/api/users`);
  }

  // 로그인 된 유저의 정보 반환
  getCurrentUser() {
    return http.get<UserType>(`/api/users/current-user`);
  }

  // 유저 수정 (사용자)
  patchUser(userData: Partial<UserType>) {
    return http.patch<UserType>(`/api/users/${userData._id}`, userData);
  }

  // 비밀번호 확인 (사용자)
  verifyPassword(password: string) {
    return http.post<boolean>(`/api/users/verify-password`, { password });
  }

  // 비밀번호 변경 (사용자)
  changePassword(currentPassword: string, newPassword: string) {
    return http.patch<boolean>(`/api/users/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  // 비밀번호 초기화 (사용자)
  resetPassword() {
    return http.post<boolean>(`/api/users/reset-password`);
  }
}

export default new UserService();
