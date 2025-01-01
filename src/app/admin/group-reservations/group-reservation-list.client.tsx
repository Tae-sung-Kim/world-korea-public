'use client';

import { usePagination } from '../hooks/usePagination';
import ListWrapper from '@/app/components/common/list-wrapper.component';
import Pagination from '@/app/components/common/pagination';
import TotalCountBottom from '@/app/components/common/total-count-bottom.component';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { GroupReservationForm } from '@/definitions';
import {
  useGroupReservationListQuery,
  useUpdateGroupReservationMutation,
} from '@/queries';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RiSave3Line } from 'react-icons/ri';

type Props = {
  tableId?: string;
};

export default function GroupReservationListClient({
  tableId = 'reservationList',
}: Props) {
  const [memos, setMemos] = useState<Record<string, string>>({});

  const router = useRouter();

  const { pageNumber = 1, pageSize = 10 } = usePagination();

  const reservationData = useGroupReservationListQuery({
    pageNumber,
    pageSize,
  });

  // 단체 예약 상세
  const handleGroupReservationClick =
    ({ id }: { id: string }) =>
    () => {
      router.push(`/admin/group-reservations/${id}`);
    };

  const updateGroupReservationMutation = useUpdateGroupReservationMutation({});

  // 단체 예약 수정(비고 입력)
  const handleGroupReservationUpdate =
    ({ id, data }: { id: string; data: GroupReservationForm }) =>
    () => {
      updateGroupReservationMutation.mutate({ id, data });
    };

  return (
    <>
      <ListWrapper>
        <Table id={tableId}>
          <TableHeader className="table-header">
            <TableRow className="list-table-row">
              <TableHead className="w-[80px] table-th" data-exclude-excel>
                번호
              </TableHead>
              <TableHead className="w-[200px] table-th">업체명</TableHead>
              <TableHead className="w-[120px] table-th">예약일</TableHead>
              <TableHead className="w-[150px] table-th">예약자명</TableHead>
              <TableHead className="w-[200px] table-th">상품명</TableHead>
              <TableHead className="w-[100px] table-th">예약 인원</TableHead>
              <TableHead className="w-[150px] table-th">연락처</TableHead>
              <TableHead className="w-[120px] table-th">방문 일자</TableHead>
              <TableHead className="w-[250px] table-th">비고</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservationData.list.map((data, idx) => {
              const customData = data.customData;
              return (
                <TableRow
                  key={data._id}
                  className="hover:bg-gray-50 transition-colors"
                  onClick={handleGroupReservationClick({ id: data._id })}
                >
                  <TableCell className="table-cell" data-exclude-excel>
                    {reservationData.totalItems -
                      (pageNumber - 1) * pageSize -
                      idx}
                  </TableCell>

                  <TableCell className="table-cell">
                    {customData.companyName as string}
                  </TableCell>
                  <TableCell className="table-cell">
                    {data.createdAt && format(data.createdAt, 'yyyy.MM.dd')}
                  </TableCell>
                  <TableCell className="table-cell">
                    {customData.guideContactInfo as string}
                  </TableCell>
                  <TableCell className="table-cell">
                    {customData.productName as string}
                  </TableCell>
                  <TableCell className="table-cell">
                    {customData.numberOfPeopel as string}
                  </TableCell>
                  <TableCell className="table-cell">
                    {customData.guideContactInfo as string}
                  </TableCell>
                  <TableCell className="table-cell">
                    {data.usedAt && format(data.usedAt, 'yyyy.MM.dd')}
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2 py-0.5">
                      <Textarea
                        value={
                          memos[data._id] ??
                          (customData as GroupReservationForm).memo ??
                          ''
                        }
                        onChange={(e) => {
                          setMemos((prev) => ({
                            ...prev,
                            [data._id]: e.target.value,
                          }));
                        }}
                        rows={2}
                        className="flex-1 resize-none text-sm focus-visible:ring-1 focus-visible:ring-blue-500 py-0.5 px-2 min-h-[28px]"
                        placeholder="비고를 입력해주세요."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-blue-50"
                        onClick={() => {
                          const newData = {
                            ...data.customData,
                            memo: memos[data._id],
                          } as GroupReservationForm;

                          return handleGroupReservationUpdate({
                            id: data._id,
                            data: newData,
                          })();
                        }}
                        title="저장"
                      >
                        <RiSave3Line className="w-4 h-4 text-blue-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ListWrapper>

      <div className="mt-4">
        <TotalCountBottom
          title="총 핀번호"
          count={reservationData.totalItems}
        />

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={reservationData.totalPages}
          totalItems={reservationData.totalItems}
          pageRange={2}
          minPages={5}
        />
      </div>
    </>
  );
}
