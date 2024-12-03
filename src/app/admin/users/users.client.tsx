'use client';

import { useUserListQuery } from '../queries';
import {
  Table,
  TableBody,
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

  const handleUserClick = (user: User) => {
    router.push(`/admin/users/${user._id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">구분</TableHead>
              <TableHead className="w-[120px]">상태</TableHead>
              <TableHead className="w-[150px]">회원명</TableHead>
              <TableHead className="w-[150px]">아이디</TableHead>
              <TableHead className="w-[150px]">회원 분류</TableHead>
              <TableHead className="w-[200px]">업체명</TableHead>
              <TableHead className="w-[150px]">업체번호</TableHead>
              <TableHead className="hidden md:table-cell w-[200px]">
                이메일
              </TableHead>
              <TableHead className="hidden md:table-cell w-[150px]">
                연락처
              </TableHead>
              <TableHead className="hidden md:table-cell w-[150px]">
                등록일
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user) => (
              <TableRow
                key={user._id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleUserClick(user)}
              >
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isPartner
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.isPartner ? '파트너' : '일반'}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isApproved
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {user.isApproved ? '승인' : '미승인'}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.loginId}</TableCell>
                <TableCell>{user.userCategory?.name}</TableCell>
                <TableCell>{user.companyName}</TableCell>
                <TableCell>{user.companyNo}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.email}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.contactNumber}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.createdAt &&
                    new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
