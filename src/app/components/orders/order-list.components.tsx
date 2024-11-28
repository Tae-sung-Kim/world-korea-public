'use client';

import SortIcons from '@/app/admin/components/sort-icons.comonent';
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
  const handleRefundClick = ({ imp_uid, amount }: RefundRequest) => {
    onRefund({
      imp_uid: 'imp_920274477579',
      amount: 1000,
    });
  };

  return (
    <>
      <Table id={tableId ?? 'exportExcelTableId'}>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[50px]" data-exclude-excel>
              번호
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSortClick('saleProduct.name')}
            >
              <SortIcons
                title="상품명"
                order={sortColumn === 'saleProduct.name' ? order : ''}
              />
            </TableHead>
            <TableHead className="min-w-[100px]">업체명</TableHead>
            <TableHead className="min-w-[100px]">담당자명</TableHead>
            <TableHead
              className="cursor-pointer min-w-[100px] text-center"
              onClick={() => handleSortClick('quantity')}
            >
              <SortIcons
                title="구매수량"
                order={sortColumn === 'quantity' ? order : ''}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer min-w-[110px] text-right"
              onClick={() => handleSortClick('totalPrice')}
            >
              <SortIcons
                title="가격"
                order={sortColumn === 'totalPrice' ? order : ''}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer min-w-[130px] text-center"
              onClick={() => handleSortClick('orderDate')}
            >
              <SortIcons
                title="구매일"
                order={sortColumn === 'orderDate' ? order : ''}
              />
            </TableHead>
            <TableHead className="min-w-[100px] text-center">
              방문예정일
            </TableHead>
            <TableHead className="min-w-[30px] text-center"></TableHead>
            <TableHead className="min-w-[30px] text-center"></TableHead>
            <TableHead className="min-w-[30px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((d, idx) => {
            return (
              <TableRow key={d._id}>
                <TableCell data-exclude-excel>
                  {ordersData.totalItems - (pageNumber - 1) * pageSize - idx}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => handleOrderListClick(d.saleProduct._id)}
                >
                  {d.saleProduct.name}
                </TableCell>
                <TableCell>
                  {/* {d.user && d.user.name} */}
                  업체명으로
                </TableCell>
                <TableCell>
                  {/* {d.user && d.user.name} */}
                  업체 담당자명
                </TableCell>
                <TableCell className="text-right">
                  {addComma(d.quantity ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  {addComma(d.totalPrice ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  {d.orderDate && new Date(d.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  방문예정일은(유효기간, 선택 날짜)
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQrCodeClick({
                        tickets: d.tickets ?? [],
                        title: d.saleProduct.name,
                      })
                    }
                  >
                    <LuQrCode />
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQrCodePrint(d.pins ?? [])}
                  >
                    <IoMdPrint />
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleRefundClick({
                        imp_uid: 'imp_920274477579',
                        amount: d.totalPrice,
                      })
                    }
                  >
                    <RiRefundLine />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={10}>총 구매</TableCell>
            <TableCell className="text-right">
              {addComma(ordersData.totalItems)} 개
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={ordersData.totalPages}
        pageRange={2}
        minPages={5}
      />
    </>
  );
}
