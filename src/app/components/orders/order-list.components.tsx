'use client';

import SortIcons from '@/app/admin/components/sort-icons.component';
import { usePagination } from '@/app/admin/hooks/usePagination';
import useSort, { SortOrder } from '@/app/admin/hooks/useSort';
import QrCodeModal from '@/app/admin/modals/qr-code.modal';
import QrCodePrintModal from '@/app/admin/orders/order-qrcode-print.modal';
import { useOrderListQuery } from '@/app/admin/queries';
import Pagination from '@/app/components/common/pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useModalContext } from '@/contexts/modal.context';
import { NameAndId, SaleProductBuyDisplayData, Tickets } from '@/definitions';
import { RefundRequest } from '@/definitions/portone.type';
import usePortonePayment from '@/hooks/usePortonePaymnent';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { IoMdPrint } from 'react-icons/io';
import { LuQrCode } from 'react-icons/lu';
import { RiRefundLine } from 'react-icons/ri';
import { toast } from 'sonner';

type Props = {
  tableId?: string;
};

type QrCodeProps = {
  title?: string;
  tickets: Tickets[];
};

export default function OrderList({ tableId }: Props) {
  const { openModal } = useModalContext();
  const router = useRouter();

  const { onRefund } = usePortonePayment();

  const {
    pageNumber = 1,
    pageSize = 10,
    filter,
  } = usePagination({
    queryFilters: { 'saleProduct.name': '' },
  });

  const ordersData = useOrderListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
  });

  const data = useMemo(() => {
    return ordersData.list;
  }, [ordersData]);

  const [sortColumn, setSortColumn] = useState<keyof (typeof data)[0] | string>(
    ''
  );
  const [order, setOrder] = useState<SortOrder>('');

  const sortedData = useSort<SaleProductBuyDisplayData<NameAndId>>({
    data,
    sortColumn,
    order,
  });

  const handleSortClick = (column: string) => {
    const isPrevColumn = sortColumn !== column;

    setSortColumn(column);
    if (isPrevColumn) {
      setOrder('asc');
    } else {
      setOrder((prevData) =>
        prevData === '' ? 'asc' : prevData === 'asc' ? 'desc' : ''
      );
    }
  };

  const handleOrderListClick = (productId: string = '') => {
    router.push('/sale-products/' + productId);
  };

  const handleQrCodeClick = async ({
    title = '구매 상품 정보',
    tickets,
  }: QrCodeProps) => {
    if (Array.isArray(tickets) && tickets.length > 0) {
      //일단은 가장 첫번째것만
      const firstTickets = [tickets[0]];
      return await openModal({
        title,
        Component: () => {
          return <QrCodeModal tickets={firstTickets} />;
        },
      });
    } else {
      toast.error('구매 상품이 잘못 되었습니다. 다시 확인해주세요.');
    }
  };

  //qrcode 프린트 - 현재는 해당되는 상품에 포함되는 모든 QR코드
  const handleQrCodePrint = async (pinList: string[]) => {
    return await openModal({
      title: 'QR CORD PRINT',
      showFooter: false,
      Component: ({ onCancel }) => {
        return <QrCodePrintModal pinList={pinList} onCancel={onCancel} />;
      },
    });
  };

  // 환불하기
  const handleRefundClick = ({ orderId, paymentId }: RefundRequest) => {
    onRefund({
      orderId,
      paymentId,
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1600px] mx-auto">
      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <div className="relative h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <div className="overflow-x-auto min-w-full">
              <Table id={tableId ?? 'exportExcelTableId'} className="min-w-[1000px]">
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow className="border-b border-gray-200 h-12">
                    <TableHead
                      className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[60px]"
                      data-exclude-excel
                    >
                      번호
                    </TableHead>
                    <TableHead
                      className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap cursor-pointer hover:text-gray-700"
                      onClick={() => handleSortClick('saleProduct.name')}
                    >
                      <SortIcons
                        title="상품명"
                        order={sortColumn === 'saleProduct.name' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap hidden md:table-cell w-[120px]">
                      업체명
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap hidden md:table-cell w-[100px]">
                      담당자명
                    </TableHead>
                    <TableHead
                      className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap cursor-pointer hover:text-gray-700 text-center w-[80px]"
                      onClick={() => handleSortClick('quantity')}
                    >
                      <SortIcons
                        title="구매수량"
                        order={sortColumn === 'quantity' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap cursor-pointer hover:text-gray-700 text-right hidden sm:table-cell w-[100px]"
                      onClick={() => handleSortClick('totalPrice')}
                    >
                      <SortIcons
                        title="가격"
                        order={sortColumn === 'totalPrice' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap cursor-pointer hover:text-gray-700 text-center hidden lg:table-cell w-[100px]"
                      onClick={() => handleSortClick('orderDate')}
                    >
                      <SortIcons
                        title="구매일"
                        order={sortColumn === 'orderDate' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap text-center hidden lg:table-cell w-[90px]">
                      방문예정일
                    </TableHead>
                    <TableHead
                      className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap text-center w-[180px]"
                      colSpan={3}
                    >
                      액션
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((d, idx) => (
                    <TableRow
                      key={d._id}
                      className="hover:bg-gray-50 transition-colors h-14"
                    >
                      <TableCell
                        className="px-4 py-3 text-gray-700 whitespace-nowrap"
                        data-exclude-excel
                      >
                        {ordersData.totalItems -
                          (pageNumber - 1) * pageSize -
                          idx}
                      </TableCell>
                      <TableCell
                        className="px-4 py-3 font-medium text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap"
                        onClick={() => handleOrderListClick(d.saleProduct._id)}
                      >
                        {d.saleProduct.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-700 whitespace-nowrap hidden md:table-cell">
                        {/* {d.user && d.user.name} */}
                        업체명으로
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-700 whitespace-nowrap hidden md:table-cell">
                        {/* {d.user && d.user.name} */}
                        업체 담당자명
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-700 whitespace-nowrap text-center">
                        {addComma(d.quantity ?? 0)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-700 whitespace-nowrap text-right hidden sm:table-cell">
                        {addComma(d.totalPrice ?? 0)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-700 whitespace-nowrap text-center hidden lg:table-cell">
                        {d.orderDate &&
                          new Date(d.orderDate).toLocaleDateString('ko-KR', {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit',
                          })}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-700 whitespace-nowrap text-center hidden lg:table-cell">
                        방문예정일은(유효기간, 선택 날짜)
                      </TableCell>
                      <TableCell className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-600 hover:text-gray-900"
                          onClick={() =>
                            handleQrCodeClick({
                              tickets: d.tickets ?? [],
                              title: d.saleProduct.name,
                            })
                          }
                        >
                          <LuQrCode className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-600 hover:text-gray-900"
                          onClick={() => handleQrCodePrint(d.pins ?? [])}
                        >
                          <IoMdPrint className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() =>
                            handleRefundClick({
                              orderId: d._id,
                              paymentId: d.paymentId,
                            })
                          }
                        >
                          <RiRefundLine className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white border-t border-gray-200 z-10">
            <Table>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-4 py-3 text-sm font-semibold text-gray-900 h-14"
                  >
                    총 구매
                  </TableCell>
                  <TableCell
                    colSpan={5}
                    className="px-4 py-3 text-sm font-semibold text-gray-900 text-right h-14"
                  >
                    {addComma(ordersData.totalItems)} 개
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={ordersData.totalPages}
          pageRange={2}
          minPages={5}
        />
      </div>
    </div>
  );
}
