import http from '@/services';
import { UserListType, UserType } from '@/types/user';

class UserService {
  // 회원 반환
  getUserById(id: string) {
    return http.get<UserType>(`/api/users/${id}`);
  }

  // 회원 목록 반환
  getUserList() {
    return http.get<UserListType>(`/api/users`);
  }

  // 회원 수정
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

  // 회원 삭제
  deleteUser() {
    return http.delete<UserListType>(`/api/users`);
  }

  getCurrentUser() {
    return http.get<UserType>(`/api/users/currentUser`);
  }

  patchUser(userData: Partial<UserType>) {
    return http.patch<UserType>(`/api/users/${userData._id}`, userData);
  }
}

export default new UserService();
