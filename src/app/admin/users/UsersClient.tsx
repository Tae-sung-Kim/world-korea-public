'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import http from '@/services';
import { UserListType } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export default function UsersClient() {
  const { data, isLoading } = useQuery({
    queryKey: ['/users'],
    queryFn: () => {
      return http.get<UserListType>('/api/users');
    },
  });
  const userList = data?.data || [];

  return (
    <Table>
      <TableCaption>회원 목록</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">아이디</TableHead>
          <TableHead>이메일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userList.map((user) => {
          const { id, email } = user;

          return (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{email}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
