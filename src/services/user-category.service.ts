import { UserCategory } from '@/definitions';
import http from '@/services';

class UserCategoryService {
  // 회원 반환
  getUserCategoryList() {
    return http.get<UserCategory[]>(`/api/user-categories`);
  }

  addUserCategory(data: UserCategory) {
    return http.post<UserCategory>(`/api/user-categories`, data);
  }

  updateUserCategory(data: UserCategory) {
    return http.patch<boolean>(`/api/user-categories/${data._id}`, data);
  }

  deleteUserCategory(id: string) {
    return http.delete<boolean>(`/api/user-categories/${id}`);
  }

  // // 회원 목록 반환
  // getUserList() {
  //   return http.get<UserListType>(`/api/users`);
  // }

  // // 회원 수정
  // updateUser(
  //   userData: Pick<
  //     User,
  //     | '_id'
  //     | 'companyName'
  //     | 'companyNo'
  //     | 'address'
  //     | 'contactNumber'
  //     | 'name'
  //     | 'phoneNumber'
  //     | 'email'
  //   >,
  // ) {
  //   return http.put<User>(`/api/users/${userData._id}`, userData);
  // }

  // // 회원 삭제
  // deleteUser() {
  //   return http.delete<UserListType>(`/api/users`);
  // }
}

const userCategoryService = new UserCategoryService();

export default userCategoryService;
