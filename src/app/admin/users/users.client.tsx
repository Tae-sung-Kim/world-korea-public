'use client';

import { useUserListQuery } from '../queries';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/definitions';
import { useRouter } from 'next/navigation';

export default function UsersClient() {
  const userList = useUserListQuery();

  const router = useRouter();

  const handleTrClick = (userData: User) => () => {
    router.push(`/admin/users/${userData._id}`);
  };

  return (
    <div className="container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>분류</TableHead>
            <TableHead>아이디</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>업체No</TableHead>
            <TableHead>업체명</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead>등록일</TableHead>
            <TableHead>승인</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((user) => {
            const {
              _id,
              userCategory,
              loginId,
              name,
              companyNo,
              companyName,
              email,
              contactNumber,
              createdAt,
              isApproved,
            } = user;

            return (
              <TableRow
                className="cursor-pointer"
                key={_id}
                onClick={handleTrClick(user)}
              >
                <TableCell>{userCategory?.name}</TableCell>
                <TableCell>{loginId}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{companyNo}</TableCell>
                <TableCell>{companyName}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{contactNumber}</TableCell>
                <TableCell>
                  {createdAt && new Date(createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{isApproved ? '승인' : '미승인'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
