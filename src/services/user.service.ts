import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import { PaginationResponse, User } from '@/definitions';
import http from '@/services';
import qs from 'qs';

class UserService {
  // 유저 반환 (관리자)
  getUserById(id: string) {
    return http.get<User>(`/api/users/${id}`);
  }

  // 유저 목록 반환 (관리자)
  getUserList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<User>>(`/api/users?${params}`);
  }

  // 유저 수정 (관리자)
  updateUser(
    userData: Pick<
      User,
      | '_id'
      | 'companyName'
      | 'companyNo'
      | 'address'
      | 'contactNumber'
      | 'name'
      | 'phoneNumber'
      | 'email'
      | 'isApproved'
      | 'isPartner'
      | 'isAdmin'
    > & { userCategoryId: string }
  ) {
    return http.patch<User>(`/api/users/${userData._id}`, userData);
  }

  // 유저 삭제 (관리자)
  deleteUser() {
    return http.delete<User[]>(`/api/users`);
  }

  // 로그인 된 유저의 정보 반환
  getCurrentUser() {
    return http.get<User>(`/api/users/current-user`);
  }

  // 유저 수정 (사용자)
  patchUser(userData: Partial<User>) {
    return http.patch<User>(`/api/users/${userData._id}`, userData);
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

  getPartnerUserList(pageParams?: PaginationProp<PageFilter>) {
    const params = qs.stringify(pageParams ?? {});

    return http.get<PaginationResponse<User>>(`/api/users/partner?${params}`);
  }

  // 유저 목록 반환 (관리자)
  getPartnerUser(id: string) {
    return http.get<Partial<User>>(`/api/users/partner/${id}`);
  }

  // 유저 수정 (사용자)
  patchPartner(userData: Partial<User>) {
    return http.patch<User>(`/api/users/partner/${userData._id}`, userData);
  }
}

const userService = new UserService();

export default userService;
