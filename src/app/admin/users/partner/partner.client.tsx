'use client';

import { usePartnerListQuery } from '../../queries';
import ListWrapper from '@/app/components/common/list-wrapper.component';
import TotalCountBottom from '@/app/components/common/total-count-bottom.component';
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
    <div className="content-search-container">
      <ListWrapper className="flex flex-col">
        <Table>
          <TableHeader className="table-header">
            <TableRow className="border-b border-gray-200">
              <TableHead className="table-th whitespace-nowrap">분류</TableHead>
              <TableHead className="table-th whitespace-nowrap">상태</TableHead>
              <TableHead className="table-th whitespace-nowrap">
                아이디
              </TableHead>
              <TableHead className="table-th whitespace-nowrap">
                회원명
              </TableHead>
              <TableHead className="table-th whitespace-nowrap">
                업체번호
              </TableHead>
              <TableHead className="table-th whitespace-nowrap">
                업체명
              </TableHead>
              <TableHead className="table-th whitespace-nowrap">
                이메일
              </TableHead>
              <TableHead className="table-th whitespace-nowrap">
                연락처
              </TableHead>
              <TableHead className="table-th whitespace-nowrap">
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
                <TableCell className="table-cell whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user.userCategory?.name}
                  </span>
                </TableCell>
                <TableCell className="table-cell whitespace-nowrap">
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
                <TableCell className="table-cell text-gray-700 whitespace-nowrap">
                  {user.loginId}
                </TableCell>
                <TableCell className="table-cell font-medium text-gray-900 whitespace-nowrap">
                  {user.name}
                </TableCell>
                <TableCell className="table-cell text-gray-700 whitespace-nowrap">
                  {user.companyNo}
                </TableCell>
                <TableCell className="table-cell text-gray-700 whitespace-nowrap">
                  {user.companyName}
                </TableCell>
                <TableCell className="table-cell text-gray-700 whitespace-nowrap">
                  {user.email}
                </TableCell>
                <TableCell className="table-cell text-gray-700 whitespace-nowrap">
                  {user.contactNumber}
                </TableCell>
                <TableCell className="table-cell text-gray-700 whitespace-nowrap">
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
      </ListWrapper>

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
