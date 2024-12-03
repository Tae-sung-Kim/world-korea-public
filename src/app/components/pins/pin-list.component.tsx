'use client';

import SortIcons from '@/app/admin/components/sort-icons.component';
import { usePagination } from '@/app/admin/hooks/usePagination';
import useSort, { SortOrder } from '@/app/admin/hooks/useSort';
import QrCodeModal from '@/app/admin/modals/qr-code.modal';
import { splitFourChar } from '@/app/admin/pins/pin.utils';
import {
  useDeletePinMutation,
  usePinsListQuery,
  useProductListQuery,
  useUsedPinMutation,
} from '@/app/admin/queries';
import Pagination from '@/app/components/common/pagination';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MODAL_TYPE, useModalContext } from '@/contexts/modal.context';
import { Pin } from '@/definitions/pin.type';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

type Props = {
  tableId?: string;
};

export default function PinList({ tableId }: Props) {
  const router = useRouter();
  const productData = useProductListQuery();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const { openModal } = useModalContext();

  const deletePinMutation = useDeletePinMutation();

  const usedPinMutation = useUsedPinMutation();

  const { pageNumber = 1, pageSize = 10 } = usePagination();

  const pinData = usePinsListQuery({
    pageNumber,
    pageSize,
  });
  const data = useMemo(() => {
    return pinData.list;
  }, [pinData]);

  const [sortColumn, setSortColumn] = useState<keyof (typeof data)[0] | string>(
    ''
  );
  const [order, setOrder] = useState<SortOrder>('');

  const sortedData = useSort<Pin>({
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

  //리스트 클릭
  const handlePinListClick = (productId: string = '') => {
    router.push('products/' + productId);
  };

  const handleProductChange = (id: string) => {
    const findProduct = productData.list.find((f) => f._id === id);
    setSelectedProductId(id);
    console.log('선택된 상품', findProduct);
  };

  //핀번호 삭제
  const handleDeletePin = ({ id, number }: { id: string; number: string }) => {
    if (!!id) {
      return openModal({
        type: MODAL_TYPE.CONFIRM,
        title: '핀번호 삭제',
        content: `${splitFourChar(number)}를 삭제 하시겠습니까?`,
        onOk: () => {
          deletePinMutation.mutate(id);
        },
      });
    }
  };

  const handleUsedPin = ({
    id = '',
    number = '',
    used = true,
  }: {
    id?: string;
    number?: string;
    used?: boolean;
  }) => {
    if (!!id) {
      return openModal({
        type: MODAL_TYPE.CONFIRM,
        title: `핀번호 ${!used ? '사용' : '취소'}`,
        content: `${splitFourChar(number)}를 사용 ${
          !used ? '완료' : '취소'
        } 하시겠습니까?`,
        onOk: () => {
          usedPinMutation.mutate({ id, used: !used });
        },
      });
    }
  };

  const handlePinNumberClick = async (pinNumber: string = '') => {
    if (!!pinNumber) {
      return await openModal({
        title: `${splitFourChar(pinNumber)}`,
        Component: () => {
          return <QrCodeModal pinNumber={splitFourChar(pinNumber) ?? ''} />;
        },
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="relative">
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          <div className="overflow-x-auto">
            <div className="min-w-[1024px]">
              <Table id={tableId}>
                <TableHeader className="sticky top-0 bg-white border-b">
                  <TableRow className="border-b border-gray-200">
                    <TableHead
                      className="w-[50px] h-12 text-sm font-semibold text-gray-900"
                      data-exclude-excel
                    >
                      <Checkbox />
                    </TableHead>
                    <TableHead
                      className="w-[50px] h-12 text-sm font-semibold text-gray-900"
                      data-exclude-excel
                    >
                      번호
                    </TableHead>
                    <TableHead
                      className="w-[200px] h-12 text-sm font-semibold text-gray-900"
                      onClick={() => handleSortClick('number')}
                    >
                      <SortIcons
                        title="핀 번호"
                        order={sortColumn === 'number' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="h-12 text-sm font-semibold text-gray-900"
                      onClick={() => handleSortClick('product.name')}
                    >
                      <SortIcons
                        title="연결 상품"
                        order={sortColumn === 'product.name' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="w-[110px] h-12 text-sm font-semibold text-gray-900 text-center">
                      <SortIcons
                        title="업체명"
                        order={sortColumn === 'product.name' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="w-[110px] h-12 text-sm font-semibold text-gray-900 text-center"
                      onClick={() => handleSortClick('endDate')}
                    >
                      <SortIcons
                        title="종료일"
                        order={sortColumn === 'endDate' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="w-[110px] h-12 text-sm font-semibold text-gray-900 text-center"
                      onClick={() => handleSortClick('createdAt')}
                    >
                      <SortIcons
                        title="생성일"
                        order={sortColumn === 'createdAt' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="w-[100px] h-12 text-sm font-semibold text-gray-900 text-center"
                      onClick={() => handleSortClick('usedDate')}
                    >
                      <SortIcons
                        title="사용여부"
                        order={sortColumn === 'usedDate' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="w-[50px] h-12 text-sm font-semibold text-gray-900 text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((pin: Pin, idx: number) => {
                    const isUsed = pin.usedDate;
                    return (
                      <TableRow key={pin._id} className="hover:bg-gray-50">
                        <TableCell data-exclude-excel>
                          <Checkbox />
                        </TableCell>
                        <TableCell data-exclude-excel>
                          {pinData.totalItems - (pageNumber - 1) * pageSize - idx}
                        </TableCell>
                        <TableCell
                          className="font-medium cursor-pointer"
                          onClick={() => handlePinNumberClick(pin.number)}
                        >
                          {splitFourChar(pin.number)}
                        </TableCell>
                        <TableCell
                          className="cursor-pointer"
                          onClick={() => handlePinListClick(pin.product?._id)}
                        >
                          {pin.product?.name}
                        </TableCell>
                        <TableCell>업체명</TableCell>
                        <TableCell className="text-right">
                          {pin.endDate &&
                            new Date(pin.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {pin.createdAt &&
                            new Date(pin.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <>
                            <Checkbox
                              onCheckedChange={() =>
                                handleUsedPin({
                                  id: pin._id,
                                  number: pin.number,
                                  used: !!isUsed,
                                })
                              }
                              checked={!!isUsed}
                            />
                            <span className="hidden">{!!isUsed ? 'Y' : 'N'}</span>
                          </>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-destructive/10"
                            onClick={() =>
                              handleDeletePin({
                                id: pin._id ?? '',
                                number: pin.number ?? '',
                              })
                            }
                          >
                            <RiDeleteBin6Line className="w-4 h-4 text-destructive" />
                          </Button>
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
      <div className="border-t border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
          <div className="text-sm font-medium text-gray-900">총 핀</div>
          <div className="text-sm font-medium text-gray-900">
            {addComma(pinData.totalItems)} 개
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={pinData.totalPages}
          pageRange={2}
          minPages={5}
        />
      </div>
    </div>
  );
}
