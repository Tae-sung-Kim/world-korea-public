'use client';

import { usePartnerListQuery } from '../../queries';
import TotalCountBottom from '@/app/components/total-count-bottom.component';
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

export default function PartnerListClient() {
  const partnersData = usePartnerListQuery();

  const router = useRouter();

  const handleListClick = (userData: User) => () => {
    router.push(`/admin/users/partner/${userData._id}`);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1920px] mx-auto">
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
        <div className="relative flex-1">
          <div className="absolute inset-0 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    분류
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    상태
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    아이디
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    회원명
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    업체번호
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    업체명
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
                {partnersData.map((user) => (
                  <TableRow
                    key={user._id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleListClick(user)()}
                  >
                    <TableCell className="p-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.userCategory?.name}
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
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap">
                      {user.loginId}
                    </TableCell>
                    <TableCell className="p-6 font-medium text-gray-900 whitespace-nowrap">
                      {user.name}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap">
                      {user.companyNo}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap">
                      {user.companyName}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap hidden md:table-cell">
                      {user.email}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap hidden md:table-cell">
                      {user.contactNumber}
                    </TableCell>
                    <TableCell className="p-6 text-gray-700 whitespace-nowrap hidden md:table-cell">
                      {user.createdAt &&
                        new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <TotalCountBottom
          title="총 파트너"
          unit="명"
          count={partnersData.length}
        />
      </div>
    </div>
  );
}
