'use client';

import SortIcons from '@/app/admin/components/sort-icons.comonent';
import { usePagination } from '@/app/admin/hooks/usePagination';
import useSort, { SortOrder } from '@/app/admin/hooks/useSort';
import QrCodeModal from '@/app/admin/modals/qr-code.modal';
import QrCodePrintModal from '@/app/admin/orders/order-qrcode-print.modal';
import { splitFourChar } from '@/app/admin/pins/pin.utils';
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
import { SaleProductBuyFormData } from '@/definitions';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { IoMdPrint } from 'react-icons/io';
import { LuQrCode } from 'react-icons/lu';

type Props = {
  tableId?: string;
};

export default function OrderList({ tableId }: Props) {
  const { openModal } = useModalContext();
  const router = useRouter();

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

  const sortedData = useSort<
    SaleProductBuyFormData<{ name: string; _id: string }>
  >({
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

  const handleQrCodeClick = async (pinNumber: string = '') => {
    if (!!pinNumber) {
      return await openModal({
        title: `${splitFourChar(pinNumber)}`,
        Component: () => {
          return <QrCodeModal pinNumber={splitFourChar(pinNumber) ?? ''} />;
        },
      });
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

  return (
    <>
      <Table id={tableId ?? 'exportExcelTableId'}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]" data-exclude-excel>
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
            <TableHead className="w-[120px]">업체명</TableHead>
            <TableHead className="w-[120px]">담당자명</TableHead>
            <TableHead
              className="cursor-pointer w-[100px] text-center"
              onClick={() => handleSortClick('quantity')}
            >
              <SortIcons
                title="구매수량"
                order={sortColumn === 'quantity' ? order : ''}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer w-[110px] text-right"
              onClick={() => handleSortClick('totalPrice')}
            >
              <SortIcons
                title="가격"
                order={sortColumn === 'totalPrice' ? order : ''}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer w-[130px] text-center"
              onClick={() => handleSortClick('orderDate')}
            >
              <SortIcons
                title="구매일"
                order={sortColumn === 'orderDate' ? order : ''}
              />
            </TableHead>
            <TableHead className="w-[130px] text-center">방문예정일</TableHead>
            <TableHead className="w-[30px] text-center"></TableHead>
            <TableHead className="w-[30px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((d, idx) => {
            // console.log('개별 상품 정보', d);
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
                    onClick={() => handleQrCodeClick(d.saleProduct._id)}
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
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>총 구매</TableCell>
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
