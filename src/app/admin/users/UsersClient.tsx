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
import userService from '@/services/userService';
import { useQuery } from '@tanstack/react-query';

export default function UsersClient() {
  const { data: userList = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUserList,
  });

  const { data: userList2 = [] } = useQuery({
    queryKey: ['users2'],
    queryFn: userService.getUserList,
  });

  return (
    <>
      <Table>
        <TableCaption>회원 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">아이디</TableHead>
            <TableHead>이메일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map(user => {
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
      <Table>
        <TableCaption>회원 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">아이디</TableHead>
            <TableHead>이메일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList2.map(user => {
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
    </>
  );
}
