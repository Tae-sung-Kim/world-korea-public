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
            <TableRow className="list-table-row">
              <TableHead className="table-th">분류</TableHead>
              <TableHead className="table-th">상태</TableHead>
              <TableHead className="table-th">아이디</TableHead>
              <TableHead className="table-th">회원명</TableHead>
              <TableHead className="table-th">업체번호</TableHead>
              <TableHead className="table-th">업체명</TableHead>
              <TableHead className="table-th">이메일</TableHead>
              <TableHead className="table-th">연락처</TableHead>
              <TableHead className="table-th">등록일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnersData.map((user) => (
              <TableRow
                key={user._id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleListClick(user)()}
              >
                <TableCell className="table-cell">
                  <span className="icon-badge bg-green-100 text-green-800">
                    {user.userCategory?.name}
                  </span>
                </TableCell>
                <TableCell className="table-cell">
                  <span
                    className={`icon-badge ${
                      user.isApproved
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user.isApproved ? '승인' : '미승인'}
                  </span>
                </TableCell>
                <TableCell className="table-cell text-gray-700">
                  {user.loginId}
                </TableCell>
                <TableCell className="table-cell font-medium text-gray-900">
                  {user.name}
                </TableCell>
                <TableCell className="table-cell text-gray-700">
                  {user.companyNo}
                </TableCell>
                <TableCell className="table-cell text-gray-700">
                  {user.companyName}
                </TableCell>
                <TableCell className="table-cell text-gray-700">
                  {user.email}
                </TableCell>
                <TableCell className="table-cell text-gray-700">
                  {user.contactNumber}
                </TableCell>
                <TableCell className="table-cell text-gray-700">
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
