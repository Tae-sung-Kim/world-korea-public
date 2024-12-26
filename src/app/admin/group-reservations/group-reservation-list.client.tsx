'use client';

import { usePagination } from '../hooks/usePagination';
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
      <div className="list-container">
        <div className="relative h-full flex flex-col">
          <div className="absolute inset-0 overflow-auto">
            <div className="min-w-[1024px]">
              <Table id={tableId}>
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow className="border-b border-gray-200">
                    <TableHead
                      className="w-[80px] h-12 text-sm font-semibold text-gray-900"
                      data-exclude-excel
                    >
                      번호
                    </TableHead>
                    <TableHead className="w-[200px] h-12 text-sm font-semibold text-gray-900">
                      업체명
                    </TableHead>
                    <TableHead className="w-[120px] h-12 text-sm font-semibold text-gray-900">
                      예약일
                    </TableHead>
                    <TableHead className="w-[150px] h-12 text-sm font-semibold text-gray-900">
                      예약자명
                    </TableHead>
                    <TableHead className="w-[200px] h-12 text-sm font-semibold text-gray-900">
                      상품명
                    </TableHead>
                    <TableHead className="w-[100px] h-12 text-sm font-semibold text-gray-900">
                      예약 인원
                    </TableHead>
                    <TableHead className="w-[150px] h-12 text-sm font-semibold text-gray-900">
                      연락처
                    </TableHead>
                    <TableHead className="w-[120px] h-12 text-sm font-semibold text-gray-900">
                      방문 일자
                    </TableHead>
                    <TableHead className="w-[250px] h-12 text-sm font-semibold text-gray-900">
                      비고
                    </TableHead>
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
                        <TableCell className="py-2 px-4" data-exclude-excel>
                          {reservationData.totalItems -
                            (pageNumber - 1) * pageSize -
                            idx}
                        </TableCell>

                        <TableCell className="py-2 px-4">
                          {customData.companyName as string}
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          {data.createdAt &&
                            format(data.createdAt, 'yyyy.MM.dd')}
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          {customData.guideContactInfo as string}
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          {customData.productName as string}
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          {customData.numberOfPeopel as string}
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          {customData.guideContactInfo as string}
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          {data.usedAt && format(data.usedAt, 'yyyy.MM.dd')}
                        </TableCell>
                        <TableCell
                          className="py-2 px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col gap-1">
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
                              className="w-full min-h-[60px] resize-none text-sm focus-visible:ring-1 focus-visible:ring-blue-500 py-1.5"
                              placeholder="비고를 입력해주세요."
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full hover:bg-blue-50 h-7 text-xs"
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
                            >
                              저장
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
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
