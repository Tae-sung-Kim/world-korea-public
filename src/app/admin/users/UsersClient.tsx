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
import { getUserList } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';

export default function UsersClient() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: getUserList,
  });
  const { data: data2 } = useQuery({
    queryKey: ['users22'],
    queryFn: getUserList,
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
          {data?.map(user => {
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
          {data2?.map(user => {
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
