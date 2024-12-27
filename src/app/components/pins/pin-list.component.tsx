'use client';

import TotalCountBottom from '../common/total-count-bottom.component';
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
import { usePartnerPinsListQuery } from '@/queries/pins.queries';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

type Props = {
  tableId?: string;
  isPartner?: boolean;
};

export default function PinList({ tableId, isPartner }: Props) {
  const router = useRouter();
  const productData = useProductListQuery();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const { openModal } = useModalContext();

  const deletePinMutation = useDeletePinMutation();

  const usedPinMutation = useUsedPinMutation();

  const { pageNumber = 1, pageSize = 10 } = usePagination();

  const searchPinsListQuery = useMemo(() => {
    return isPartner ? usePartnerPinsListQuery : usePinsListQuery;
  }, [isPartner]);

  const pinData = searchPinsListQuery({
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
    <>
      <div className="list-container">
        <div className="list-content-wrapper">
          <div className="absolute inset-0 overflow-auto">
            <div className="min-w-[1024px]">
              <Table id={tableId}>
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="w-[50px] table-th" data-exclude-excel>
                      <Checkbox />
                    </TableHead>
                    <TableHead className="w-[50px] table-th" data-exclude-excel>
                      번호
                    </TableHead>
                    <TableHead
                      className="w-[200px] table-th cursor-pointer"
                      onClick={() => handleSortClick('number')}
                    >
                      <SortIcons
                        title="핀 번호"
                        order={sortColumn === 'number' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="table-th cursor-pointer"
                      onClick={() => handleSortClick('product.name')}
                    >
                      <SortIcons
                        title="연결 상품"
                        order={sortColumn === 'product.name' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="w-[110px] table-th text-center">
                      <SortIcons
                        title="업체명"
                        order={sortColumn === 'product.name' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="w-[110px] table-th text-center cursor-pointer"
                      onClick={() => handleSortClick('endDate')}
                    >
                      <SortIcons
                        title="종료일"
                        order={sortColumn === 'endDate' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="w-[110px] table-th text-center cursor-pointer"
                      onClick={() => handleSortClick('createdAt')}
                    >
                      <SortIcons
                        title="생성일"
                        order={sortColumn === 'createdAt' ? order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="w-[100px] table-th text-center cursor-pointer"
                      onClick={() => handleSortClick('usedDate')}
                    >
                      <SortIcons
                        title="사용여부"
                        order={sortColumn === 'usedDate' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="w-[50px] table-th text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((pin: Pin, idx: number) => {
                    const isUsed = pin.usedDate;
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
                        <TableCell
                          className="p-4 font-medium text-gray-900 cursor-pointer"
                          onClick={() => handlePinNumberClick(pin.number)}
                        >
                          {splitFourChar(pin.number)}
                        </TableCell>
                        <TableCell
                          className="p-4 text-gray-700 cursor-pointer"
                          onClick={() => handlePinListClick(pin.product?._id)}
                        >
                          {pin.product?.name}
                        </TableCell>
                        <TableCell className="p-4 text-gray-700 text-center">
                          업체명
                        </TableCell>
                        <TableCell className="p-4 text-gray-700 text-center">
                          {pin.endDate &&
                            new Date(pin.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="p-4 text-gray-700 text-center">
                          {pin.createdAt &&
                            new Date(pin.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="p-4 text-center">
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
                            <span className="hidden">
                              {!!isUsed ? 'Y' : 'N'}
                            </span>
                          </>
                        </TableCell>
                        <TableCell className="p-4 text-center">
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
      <div className="mt-4">
        <TotalCountBottom title="총 핀번호" count={pinData.totalItems} />

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={pinData.totalPages}
          totalItems={pinData.totalItems}
          pageRange={2}
          minPages={5}
        />
      </div>
    </>
  );
}
