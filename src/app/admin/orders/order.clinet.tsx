'use client';

import QrCodeModal from '../components/qr-code.modal';
import useExcelExport from '../hooks/useExcelExport';
import { usePagination } from '../hooks/usePagination';
import { splitFourChar } from '../pins/pin.utils';
import { useOrderListQuery } from '../queries';
import QrCodePrintModal from './order-qrcode-print.modal';
import OrderSearch from './order-search.component';
import Pagination from '@/app/common/components/pagination';
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
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { IoMdPrint } from 'react-icons/io';
import { LuQrCode } from 'react-icons/lu';
import { RiFileExcel2Line } from 'react-icons/ri';

export default function OrderListClient() {
  const { openModal } = useModalContext();
  const router = useRouter();

  const { pageNumber = 1, pageSize = 10 } = usePagination();

  const exportToExcel = useExcelExport();

  const ordersData = useOrderListQuery({
    pageNumber,
    pageSize,
  });

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
      <div className="flex">
        <OrderSearch />
        <div className="flex-grow" />

        <Button
          className="m-5"
          variant="outline"
          size="icon"
          onClick={() =>
            exportToExcel({
              tableId: 'orderExportExcelTable',
              fileName: 'test',
            })
          }
        >
          <RiFileExcel2Line />
        </Button>
      </div>
      <Table id="orderExportExcelTable">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]" data-exclude-excel>
              번호
            </TableHead>
            <TableHead className="">상품명</TableHead>
            <TableHead className="w-[120px]">업체명</TableHead>
            <TableHead className="w-[120px]">담당자명</TableHead>
            <TableHead className="w-[80px] text-center">구매수량</TableHead>
            <TableHead className="w-[110px] text-right">가격</TableHead>
            <TableHead className="w-[130px] text-center">구매일</TableHead>
            <TableHead className="w-[130px] text-center">방문예정일</TableHead>
            <TableHead className="w-[30px] text-center"></TableHead>
            <TableHead className="w-[30px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersData.list.map((d, idx) => {
            console.log('개별 상품 정보', d);
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
