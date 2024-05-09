import http from '@/services';
import { UserListType } from '@/types/user';

export function getUserList() {
  return http.get<UserListType>('/api/users');
}
