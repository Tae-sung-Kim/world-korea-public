'use client';

import SortIcons from '../../components/sort-icons.component';
import { usePagination } from '../../hooks/usePagination';
import useSort from '../../hooks/useSort';
import { usePartnerListQuery } from '../../queries';
import ListWrapper from '@/app/components/common/list-wrapper.component';
import Paginations from '@/app/components/common/pagination.component';
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
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function PartnerListClient() {
  const { pageNumber, pageSize, filter } = usePagination();
  const { sort, onSort } = useSort();

  const partnersData = usePartnerListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
    sort,
  });

  const data = useMemo(() => {
    return partnersData.list;
  }, [partnersData]);

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
              <TableHead
                className="table-th cursor-pointer"
                onClick={() => onSort('userCategory.level')}
              >
                <SortIcons
                  title="분류"
                  order={sort.name === 'userCategory.level' ? sort.order : ''}
                />
              </TableHead>
              <TableHead
                className="table-th cursor-pointer"
                onClick={() => onSort('isApproved')}
              >
                <SortIcons
                  title="상태"
                  order={sort.name === 'isApproved' ? sort.order : ''}
                />
              </TableHead>
              <TableHead
                className="table-th cursor-pointer"
                onClick={() => onSort('loginId')}
              >
                <SortIcons
                  title="아이디"
                  order={sort.name === 'loginId' ? sort.order : ''}
                />
              </TableHead>
              <TableHead
                className="table-th cursor-pointer"
                onClick={() => onSort('name')}
              >
                <SortIcons
                  title="회원명"
                  order={sort.name === 'name' ? sort.order : ''}
                />
              </TableHead>
              <TableHead
                className="table-th cursor-pointer"
                onClick={() => onSort('companyName')}
              >
                <SortIcons
                  title="업체명"
                  order={sort.name === 'companyName' ? sort.order : ''}
                />
              </TableHead>
              <TableHead
                className="table-th cursor-pointer"
                onClick={() => onSort('companyNo')}
              >
                <SortIcons
                  title="업체번호"
                  order={sort.name === 'companyNo' ? sort.order : ''}
                />
              </TableHead>
              <TableHead className="table-th">이메일</TableHead>
              <TableHead className="table-th">연락처</TableHead>
              <TableHead className="table-th">등록일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
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
                <TableCell className="table-cell">{user.loginId}</TableCell>
                <TableCell className="table-cell font-medium text-gray-900">
                  {user.name}
                </TableCell>
                <TableCell className="table-cell">{user.companyName}</TableCell>
                <TableCell className="table-cell">{user.companyNo}</TableCell>
                <TableCell className="table-cell">{user.email}</TableCell>
                <TableCell className="table-cell">
                  {user.contactNumber}
                </TableCell>
                <TableCell className="table-cell">
                  {user.createdAt &&
                    format(new Date(user.createdAt), 'yyyy. M. dd')}
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
          count={partnersData.totalItems}
        />

        <Paginations
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={partnersData.totalPages}
          totalItems={partnersData.totalItems}
        />
      </div>
    </div>
  );
}
