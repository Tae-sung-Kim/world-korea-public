'use client';

import ListWrapper from '../common/list-wrapper.component';
import TotalCountBottom from '../common/total-count-bottom.component';
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
import { MODAL_TYPE, useModalContext } from '@/contexts/modal.context';
import {
  UserInfo,
  SaleProductBuyDisplayData,
  Tickets,
  OrderStatus,
  ORDER_STATUS_MESSAGE,
  ORDER_PAY_TYPE_MESSAGE,
  RefundRequest,
  OrderPayType,
} from '@/definitions';
import usePortonePayment from '@/hooks/usePortonePayment';
import { useMyOrderListQuery } from '@/queries';
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
  isMy?: boolean;
};

type QrCodeProps = {
  title?: string;
  tickets: Tickets[];
};

interface ExtendedRefundRequest extends RefundRequest {
  title: string;
  orderDate: Date | string;
  payType: OrderPayType;
}

export default function OrderList({ tableId, isMy }: Props) {
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

  const searchOrderListQuery = useMemo(() => {
    return isMy ? useMyOrderListQuery : useOrderListQuery;
  }, [isMy]);

  let ordersData = searchOrderListQuery({
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
        useCancelButton: false,
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
  const handleRefundClick = ({
    orderId,
    paymentId,
    title,
    orderDate,
    payType,
  }: ExtendedRefundRequest) => {
    openModal({
      type: MODAL_TYPE.CONFIRM,
      title: title,
      content: (
        <div className="space-y-4 py-2">
          <p className="text-gray-700">이 상품을 환불 하시겠습니까?</p>
          <div className="rounded-md bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">구매일</span>
              <span className="font-medium">
                {format(new Date(orderDate), 'yyyy-MM-dd')}
              </span>
            </div>
          </div>
        </div>
      ),
      onOk: () => {
        onRefund({
          orderId,
          paymentId,
          payType,
        });
      },
    });
  };

  return (
    <>
      <ListWrapper>
        <Table id={tableId ?? 'exportExcelTableId'}>
          <TableHeader className="table-header">
            <TableRow className="list-table-row">
              <TableHead className="w-[70px] table-th" data-exclude-excel>
                번호
              </TableHead>
              <TableHead
                className="w-[200px] table-th cursor-pointer"
                onClick={() => handleSortClick('saleProduct.name')}
              >
                <SortIcons
                  title="상품명"
                  order={sortColumn === 'saleProduct.name' ? order : ''}
                />
              </TableHead>
              <TableHead className="w-[110px] table-th text-center">
                업체명
              </TableHead>
              <TableHead className="w-[110px] table-th text-center">
                담당자명
              </TableHead>
              <TableHead
                className="w-[180px] table-th text-center cursor-pointer"
                onClick={() => handleSortClick('quantity')}
              >
                <SortIcons
                  title="구매수량"
                  order={sortColumn === 'quantity' ? order : ''}
                />
              </TableHead>
              <TableHead
                className="w-[110px] table-th text-right cursor-pointer"
                onClick={() => handleSortClick('totalPrice')}
              >
                <SortIcons
                  title="가격"
                  order={sortColumn === 'totalPrice' ? order : ''}
                />
              </TableHead>
              <TableHead
                className="w-[110px] table-th text-center cursor-pointer"
                onClick={() => handleSortClick('orderDate')}
              >
                <SortIcons
                  title="구매일"
                  order={sortColumn === 'orderDate' ? order : ''}
                />
              </TableHead>
              <TableHead className="w-[120px] table-th text-center">
                방문예정일
              </TableHead>
              <TableHead className="w-[110px] table-th text-center">
                결제 방법
              </TableHead>
              <TableHead className="w-[110px] table-th text-center">
                결제 상태
              </TableHead>
              {!isMy && (
                <TableHead className="min-w-[110px] table-th text-center"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((d, idx) => (
              <TableRow
                key={d._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="table-cell" data-exclude-excel>
                  {ordersData.totalItems - (pageNumber - 1) * pageSize - idx}
                </TableCell>
                <TableCell
                  className="table-cell font-medium list-click-color"
                  onClick={() => handleOrderListClick(d.saleProduct._id)}
                >
                  {d.saleProduct.name}
                </TableCell>
                <TableCell className="table-cell text-gray-700 text-center">
                  {d.user.companyName}
                </TableCell>
                <TableCell className="table-cell text-gray-700 text-center">
                  {d.user.name}
                </TableCell>
                <TableCell className="table-cell text-gray-700 text-center">
                  {addComma(d.quantity ?? 0)}
                </TableCell>
                <TableCell className="table-cell text-gray-700 text-right">
                  {addComma(d.totalPrice ?? 0)}
                </TableCell>
                <TableCell className="table-cell text-gray-700 text-center">
                  {d.orderDate &&
                    format(new Date(d.orderDate), 'yy.MM.dd HH:mm')}
                </TableCell>
                <TableCell className="table-cell text-gray-700 text-center">
                  {d.visitDate && format(new Date(d.visitDate), 'yy.MM.dd')}
                </TableCell>
                <TableCell className="table-cell text-gray-700 text-center">
                  {ORDER_PAY_TYPE_MESSAGE[d.payType]}
                </TableCell>
                <TableCell className="table-cell text-gray-700 text-center">
                  {ORDER_STATUS_MESSAGE[d.status]}
                </TableCell>
                {!isMy && (
                  <TableCell className="table-cell text-center">
                    {OrderStatus.Completed === d.status && (
                      <>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-600 hover:text-gray-900"
                          onClick={() => handleQrCodePrint(d.tickets ?? [])}
                        >
                          <IoMdPrint className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() =>
                            handleRefundClick({
                              title: d.saleProduct.name,
                              orderDate: d.orderDate,
                              orderId: d._id,
                              paymentId: d.paymentId,
                              payType: d.payType,
                            })
                          }
                        >
                          <RiRefundLine className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ListWrapper>

      <div className="mt-4">
        <TotalCountBottom count={ordersData.totalItems} />
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={ordersData.totalPages}
          totalItems={ordersData.totalItems}
          pageRange={2}
          minPages={5}
        />
      </div>
    </>
  );
}
