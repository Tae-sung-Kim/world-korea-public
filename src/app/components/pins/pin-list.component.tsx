'use client';

import ListWrapper from '../common/list-wrapper.component';
import NoDataFound from '../common/no-data-found.component';
import TotalCountBottom from '../common/total-count-bottom.component';
import SortIcons from '@/app/admin/components/sort-icons.component';
import { usePagination } from '@/app/admin/hooks/usePagination';
import useSort from '@/app/admin/hooks/useSort';
import QrCodeModal from '@/app/admin/modals/qr-code.modal';
import { splitFourChar } from '@/app/admin/pins/pin.utils';
import {
  useDeletePinMutation,
  usePinsListQuery,
  useProductListQuery,
  useUsedPinMutation,
} from '@/app/admin/queries';
import Pagination from '@/app/components/common/pagination.component';
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
import { OrderStatus } from '@/definitions';
import { Pin } from '@/definitions/pin.type';
import { usePartnerPinsListQuery } from '@/queries/pins.queries';
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

  const { pageNumber = 1, pageSize = 10, filter } = usePagination();
  const { sort, onSort } = useSort();

  const searchPinsListQuery = useMemo(() => {
    return isPartner ? usePartnerPinsListQuery : usePinsListQuery;
  }, [isPartner]);

  const pinData = searchPinsListQuery({
    pageNumber,
    pageSize,
    filter,
    sort,
  });

  const data = useMemo(() => {
    return pinData.list;
  }, [pinData]);

  // 상품 상세 이동
  const handleProductMove = (productId: string = '') => {
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

  const handlePinNumberClick = async ({
    name,
    pinNumber,
  }: {
    name: string;
    pinNumber: string;
  }) => {
    if (!!pinNumber) {
      return await openModal({
        title: name,
        Component: () => {
          return <QrCodeModal pinNumber={splitFourChar(pinNumber)} />;
        },
        useCancelButton: false,
      });
    }
  };

  return (
    <>
      {data.length > 0 ? (
        <>
          <ListWrapper>
            <Table id={tableId}>
              <TableHeader className="table-header">
                <TableRow className="list-table-row">
                  <TableHead className="w-[50px] table-th" data-exclude-excel>
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-[50px] table-th" data-exclude-excel>
                    번호
                  </TableHead>
                  <TableHead
                    className="w-[200px] table-th cursor-pointer"
                    onClick={() => onSort('number')}
                  >
                    <SortIcons
                      title="핀 번호"
                      order={sort.name === 'number' ? sort.order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="table-th cursor-pointer"
                    onClick={() => onSort('product.name')}
                  >
                    <SortIcons
                      title="연결 상품"
                      order={sort.name === 'product.name' ? sort.order : ''}
                    />
                  </TableHead>
                  {!isPartner && (
                    <TableHead
                      className="w-[110px] table-th cursor-pointer"
                      onClick={() => onSort('partner.companyName')}
                    >
                      <SortIcons
                        title="업체명"
                        order={
                          sort.name === 'partner.companyName' ? sort.order : ''
                        }
                      />
                    </TableHead>
                  )}
                  <TableHead
                    className="w-[110px] table-th cursor-pointer"
                    onClick={() => onSort('endDate')}
                  >
                    <SortIcons
                      title="종료일"
                      order={sort.name === 'endDate' ? sort.order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="w-[110px] table-th cursor-pointer"
                    onClick={() => onSort('createdAt')}
                  >
                    <SortIcons
                      title="생성일"
                      order={sort.name === 'createdAt' ? sort.order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="w-[100px] table-th cursor-pointer"
                    onClick={() => onSort('usedDate')}
                  >
                    <SortIcons
                      title="사용여부"
                      order={sort.name === 'usedDate' ? sort.order : ''}
                    />
                  </TableHead>
                  {!isPartner && (
                    <TableHead className="w-[50px] table-th"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((pin: Pin, idx: number) => {
                  const isUsed = !!pin.usedDate;

                  return (
                    <TableRow
                      key={pin._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="table-cell" data-exclude-excel>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="table-cell" data-exclude-excel>
                        {pinData.totalItems - (pageNumber - 1) * pageSize - idx}
                      </TableCell>
                      <TableCell
                        className="table-cell font-medium "
                        // onClick={() =>
                        //   handlePinNumberClick({
                        //     name: pin.product?.name ?? '',
                        //     pinNumber: pin.number ?? '',
                        //   })
                        // }
                      >
                        {splitFourChar(pin.number)}
                      </TableCell>
                      <TableCell
                        className={`table-cell ${isPartner ? '' : 'list-link'}`}
                        onClick={
                          isPartner
                            ? undefined
                            : () => handleProductMove(pin.product?._id)
                        }
                      >
                        {pin.product?.name}
                      </TableCell>
                      {!isPartner && (
                        <TableCell className="table-cell text-gray-700">
                          {pin.partner?.companyName}
                        </TableCell>
                      )}
                      <TableCell className="table-cell text-gray-700">
                        {pin.endDate &&
                          new Date(pin.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="table-cell text-gray-700">
                        {pin.createdAt &&
                          new Date(pin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="table-cell">
                        <>
                          <Checkbox
                            onCheckedChange={() =>
                              handleUsedPin({
                                id: pin._id,
                                number: pin.number,
                                used: isUsed,
                              })
                            }
                            checked={isUsed}
                          />
                          <span className="hidden">{isUsed ? 'Y' : 'N'}</span>
                        </>
                      </TableCell>
                      {!isPartner && (
                        <TableCell className="table-cell">
                          {!isUsed &&
                            pin.orderStatus === OrderStatus.Unpaid && (
                              // 사용중이거나, unpaid상태 일때만 삭제 버튼 노출
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
                                <RiDeleteBin6Line className="icon-delete" />
                              </Button>
                            )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ListWrapper>
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
      ) : (
        <NoDataFound />
      )}
    </>
  );
}
