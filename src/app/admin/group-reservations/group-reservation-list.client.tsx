'use client';

import { usePagination } from '../hooks/usePagination';
import TotalCountBottom from '@/app/components/common/total-count-bottom.component';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGroupReservationListQuery } from '@/queries';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

type Props = {
  tableId?: string;
};

export default function GroupReservationListClient({
  tableId = 'reservationList',
}: Props) {
  const router = useRouter();

  const { pageNumber = 1, pageSize = 10 } = usePagination();

  const reservationData = useGroupReservationListQuery({
    pageNumber,
    pageSize,
  });

  const handleGroupReservationClick =
    ({ id }: { id: string }) =>
    () => {
      router.push(`/admin/group-reservations/${id}`);
    };

  return (
    <>
      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <div className="relative h-full flex flex-col">
          <div className="absolute inset-0 overflow-auto">
            <div className="min-w-[1024px]">
              <Table id={tableId}>
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow className="border-b border-gray-200">
                    <TableHead
                      className="w-[50px] h-12 text-sm font-semibold text-gray-900"
                      data-exclude-excel
                    >
                      번호
                    </TableHead>
                    <TableHead className="w-[50px] h-12 text-sm font-semibold text-gray-900">
                      업체명
                    </TableHead>
                    <TableHead className="w-[50px] h-12 text-sm font-semibold text-gray-900">
                      예약일
                    </TableHead>
                    <TableHead className="w-[50px] h-12 text-sm font-semibold text-gray-900">
                      예약자명
                    </TableHead>
                    <TableHead className="w-[50px] h-12 text-sm font-semibold text-gray-900">
                      상품명
                    </TableHead>
                    <TableHead className="w-[50px] h-12 text-sm font-semibold text-gray-900">
                      예약 인원
                    </TableHead>
                    <TableHead className="w-[50px] h-12 text-sm font-semibold text-gray-900">
                      연락처
                    </TableHead>
                    <TableHead className="w-[50px] h-12 text-sm font-semibold text-gray-900">
                      방문 일자
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
                        <TableCell className="p-4" data-exclude-excel>
                          {reservationData.totalItems -
                            (pageNumber - 1) * pageSize -
                            idx}
                        </TableCell>

                        <TableCell className="p-4">
                          {customData.companyName as string}
                        </TableCell>
                        <TableCell className="p-4">
                          {data.createdAt &&
                            format(data.createdAt, 'yyyy.MM.dd')}
                        </TableCell>
                        <TableCell className="p-4">
                          {customData.guideContactInfo as string}
                        </TableCell>
                        <TableCell className="p-4">
                          {customData.productName as string}
                        </TableCell>
                        <TableCell className="p-4">
                          {customData.numberOfPeopel as string}
                        </TableCell>
                        <TableCell className="p-4">
                          {customData.guideContactInfo as string}
                        </TableCell>
                        <TableCell className="p-4">
                          {data.usedAt && format(data.usedAt, 'yyyy.MM.dd')}
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
      {/* <div className="mt-4">
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
      </div> */}
    </>
  );
}
