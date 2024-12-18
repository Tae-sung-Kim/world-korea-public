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

type Props = {
  tableId?: string;
};

export default function GroupReservationListClient({
  tableId = 'reservationList',
}: Props) {
  const { pageNumber = 1, pageSize = 10 } = usePagination();
  const reservationData = useGroupReservationListQuery({
    pageNumber,
    pageSize,
  });

  console.log('reservationData', reservationData);

  return (
    <>
      {/* <div className="flex-1 bg-white rounded-lg shadow-sm">
        <div className="relative h-full flex flex-col">
          <div className="absolute inset-0 overflow-auto">
            <div className="min-w-[1024px]">
              <Table id={tableId}>
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow className="border-b border-gray-200">
                    <TableHead
                      className="w-[50px] h-12 text-sm font-semibold text-gray-900"
                      data-exclude-excel
                    ></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservationData.map((data) => {
                    return (
                      <TableRow
                        key={pin._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="p-4" data-exclude-excel>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="p-4" data-exclude-excel>
                          {pinData.totalItems -
                            (pageNumber - 1) * pageSize -
                            idx}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="mt-4">
        <TotalCountBottom
          title="총 핀번호"
          count={reservationData.totalItems}
        />

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={pinData.totalPages}
          totalItems={pinData.totalItems}
          pageRange={2}
          minPages={5}
        />
      </div> */}
    </>
  );
}
