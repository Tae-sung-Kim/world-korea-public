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
import { UserInfo, SaleProductBuyDisplayData, Tickets } from '@/definitions';
import { RefundRequest } from '@/definitions/portone.type';
import usePortonePayment from '@/hooks/usePortonePaymnent';
import { addComma } from '@/utils/number';
import { format } from 'date-fns';
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

  const sortedData = useSort<SaleProductBuyDisplayData<UserInfo>>({
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
  const handleQrCodePrint = async (tickets: Tickets[]) => {
    return await openModal({
      title: 'QR 코드 프린트',
      showFooter: false,
      Component: ({ onCancel }) => {
        return <QrCodePrintModal tickets={tickets} onCancel={onCancel} />;
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
    <>
      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <div className="relative h-full flex flex-col">
          <div className="absolute inset-0 overflow-auto">
            <div className="min-w-[1024px] pb-16">
              <Table id={tableId ?? 'exportExcelTableId'}>
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow className="border-b border-gray-200">
                    <TableHead
                      className="w-[50px] h-12 text-sm font-semibold text-gray-900"
                      data-exclude-excel
                    >
                      번호
                    </TableHead>
                    <TableHead
                      className="w-[200px] h-12 text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSortClick('saleProduct.name')}
                    >
                      <SortIcons
                        title="상품명"
                        order={sortColumn === 'saleProduct.name' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="w-[110px] h-12 text-sm font-semibold text-gray-900 text-center">
                      업체명
                    </TableHead>
                    <TableHead className="w-[110px] h-12 text-sm font-semibold text-gray-900 text-center">
                      담당자명
                    </TableHead>
                    <TableHead
                      className="w-[100px] h-12 text-sm font-semibold text-gray-900 text-center cursor-pointer"
                      onClick={() => handleSortClick('quantity')}
                    >
                      <SortIcons
                        title="구매수량"
                        order={sortColumn === 'quantity' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="w-[110px] h-12 text-sm font-semibold text-gray-900 text-right cursor-pointer"
                      onClick={() => handleSortClick('totalPrice')}
                    >
                      <SortIcons
                        title="가격"
                        order={sortColumn === 'totalPrice' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="w-[110px] h-12 text-sm font-semibold text-gray-900 text-center cursor-pointer"
                      onClick={() => handleSortClick('orderDate')}
                    >
                      <SortIcons
                        title="구매일"
                        order={sortColumn === 'orderDate' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="w-[110px] h-12 text-sm font-semibold text-gray-900 text-center">
                      방문예정일
                    </TableHead>
                    <TableHead
                      className="w-[150px] h-12 text-sm font-semibold text-gray-900 text-center"
                      colSpan={3}
                    ></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((d, idx) => (
                    <TableRow
                      key={d._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="p-4" data-exclude-excel>
                        {ordersData.totalItems -
                          (pageNumber - 1) * pageSize -
                          idx}
                      </TableCell>
                      <TableCell
                        className="p-4 font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => handleOrderListClick(d.saleProduct._id)}
                      >
                        {d.saleProduct.name}
                      </TableCell>
                      <TableCell className="p-4 text-gray-700 text-center">
                        {d.user.name}
                      </TableCell>
                      <TableCell className="p-4 text-gray-700 text-center">
                        {d.user.companyName}
                      </TableCell>
                      <TableCell className="p-4 text-gray-700 text-center">
                        {addComma(d.quantity ?? 0)}
                      </TableCell>
                      <TableCell className="p-4 text-gray-700 text-right">
                        {addComma(d.totalPrice ?? 0)}
                      </TableCell>
                      <TableCell className="p-4 text-gray-700 text-center">
                        {d.orderDate &&
                          format(new Date(d.orderDate), 'yy.MM.dd HH:mm')}
                      </TableCell>
                      <TableCell className="p-4 text-gray-700 text-center">
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
                          onClick={() => handleQrCodePrint(d.tickets ?? [])}
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
          <div className="mt-auto sticky bottom-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1)] z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    총 구매
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-primary">
                    {addComma(ordersData.totalItems)}
                  </span>
                  <span className="text-sm font-medium text-gray-600">개</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={ordersData.totalPages}
          pageRange={2}
          minPages={5}
        />
      </div>
    </>
  );
}
