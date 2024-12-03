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
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1920px] mx-auto">
      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <div className="relative h-full">
          <div className="absolute inset-0 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    구분
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    상태
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    회원명
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    아이디
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    회원 분류
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    업체명
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    업체번호
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap hidden md:table-cell">
                    이메일
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap hidden md:table-cell">
                    연락처
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap hidden md:table-cell">
                    등록일
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userList.map((user) => (
                  <TableRow
                    key={user._id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleUserClick(user)}
                  >
                    <TableCell className="p-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isPartner
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.isPartner ? '파트너' : '일반'}
                      </span>
                    </TableCell>
                    <TableCell className="p-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isApproved
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.isApproved ? '승인' : '미승인'}
                      </span>
                    </TableCell>
                    <TableCell className="p-6 font-medium text-gray-900 whitespace-nowrap">
                      {user.name}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap">
                      {user.loginId}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap">
                      {user.userCategory?.name}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap">
                      {user.companyName}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap">
                      {user.companyNo}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap hidden md:table-cell">
                      {user.email}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap hidden md:table-cell">
                      {user.contactNumber}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap hidden md:table-cell">
                      {user.createdAt &&
                        new Intl.DateTimeFormat('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }).format(new Date(user.createdAt))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
