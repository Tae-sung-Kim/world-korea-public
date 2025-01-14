'use client';

import ListWrapper from '../common/list-wrapper.component';
import NoDataFound from '../common/no-data-found.component';
import TotalCountBottom from '../common/total-count-bottom.component';
import ExportExcelButton from '@/app/admin/components/export-excel-button.component';
import IconDeleteButton from '@/app/admin/components/icon-delete-button.component';
import SortIcons from '@/app/admin/components/sort-icons.component';
import { usePagination } from '@/app/admin/hooks/usePagination';
import useSort from '@/app/admin/hooks/useSort';
import QrCodeModal from '@/app/admin/modals/qr-code.modal';
import PinSearch from '@/app/admin/pins/pin-search.component';
import {
  useDeletePinMutation,
  useDeletePinsMutation,
  usePinsListQuery,
  useProductListQuery,
  useUsedPinMutation,
} from '@/app/admin/queries';
import { splitFourChar } from '@/app/api/utils/pin.utils';
import Pagination from '@/app/components/common/pagination.component';
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
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';

type Props = {
  isPartner?: boolean;
};

export default function PinList({ isPartner }: Props) {
  const tableIdRef = useRef('pinExportExcelTable');

  const router = useRouter();
  const productData = useProductListQuery();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const { openModal } = useModalContext();

  const [checkedPins, setCheckedPins] = useState<string[]>([]);

  // 단건 pin 삭제
  const deletePinMutation = useDeletePinMutation();
  // 다건 pin 삭제
  const deletePinsMutation = useDeletePinsMutation();

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

  const checkabledPins = useMemo(() => {
    return data.filter((f) => {
      //핀 사용 여부
      const isUsed = !!f.usedDate;
      // 핀 상태
      const pinStatus = f.orderStatus === OrderStatus.Unpaid;
      return !isUsed && pinStatus;
    });
  }, [data]);

  // 상품 상세 이동
  const handleProductMove = (productId: string = '') => {
    router.push('products/' + productId);
  };

  // 개별 선택
  const handleCheck = (id: string) => {
    setCheckedPins((prevData) => {
      if (prevData.includes(id)) {
        return prevData.filter((pinId) => pinId !== id);
      } else {
        return [...prevData, id];
      }
    });
  };

  // 전체 선택 - 삭제 불가능 Pin 제외
  const handleAllCheck = (data: string[]) => {
    setCheckedPins(data);
  };

  const handleProductChange = (id: string) => {
    const findProduct = productData.list.find((f) => f._id === id);
    setSelectedProductId(id);
    console.log('선택된 상품', findProduct);
  };

  // 핀번호 삭제
  const handleDeletePin = ({ id, number }: { id: string; number: string }) => {
    if (!!id) {
      return openModal({
        type: MODAL_TYPE.CONFIRM,
        title: 'Pin 삭제',
        content: <DeletePinModal number={[number]} />,
        onOk: () => {
          deletePinMutation.mutate(id);
        },
      });
    }
  };

  // 다건 핀번호 삭제
  const handleDeletePins = () => {
    const pinNumbers = checkabledPins
      .filter((f) => f._id && checkedPins.includes(f._id))
      .map((d) => d.number ?? '');

    if (checkedPins.length > 0) {
      return openModal({
        type: MODAL_TYPE.CONFIRM,
        title: 'Pin 삭제',
        content: <DeletePinModal number={pinNumbers} />,
        onOk: () => {
          deletePinsMutation.mutate(checkedPins);
        },
      });
    }
  };

  // 핀 번호 단건 사용
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
    <div className="content-search-container">
      <div className="list-search-buttons">
        <div className="flex-1 max-w-xl">
          <PinSearch />
        </div>
        <ExportExcelButton tableId={tableIdRef.current} fileName="핀리스트" />
        {/* 여러건 삭제 */}
        {!isPartner && (
          <IconDeleteButton
            variant="outline"
            className="ml-2"
            onDelete={handleDeletePins}
          />
        )}
        {/* 핀 사용 처리 */}
      </div>

      {data.length > 0 ? (
        <>
          <ListWrapper>
            <Table id={tableIdRef.current}>
              <TableHeader className="table-header">
                <TableRow className="list-table-row">
                  {!isPartner && (
                    <TableHead className="table-th" data-exclude-excel>
                      <Checkbox
                        onCheckedChange={(checked) => {
                          const checkData = checkabledPins.map(
                            (item) => item._id ?? ''
                          );

                          return handleAllCheck(checked ? checkData : []);
                        }}
                        checked={checkedPins.length === checkabledPins.length}
                      />
                    </TableHead>
                  )}
                  <TableHead className="table-th" data-exclude-excel>
                    번호
                  </TableHead>
                  <TableHead
                    className="table-th cursor-pointer"
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
                      title="상품명"
                      order={sort.name === 'product.name' ? sort.order : ''}
                    />
                  </TableHead>
                  {!isPartner && (
                    <TableHead
                      className="table-th cursor-pointer"
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
                    className="table-th cursor-pointer"
                    onClick={() => onSort('endDate')}
                  >
                    <SortIcons
                      title="종료일"
                      order={sort.name === 'endDate' ? sort.order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="table-th cursor-pointer"
                    onClick={() => onSort('createdAt')}
                  >
                    <SortIcons
                      title="생성일"
                      order={sort.name === 'createdAt' ? sort.order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="table-th cursor-pointer"
                    onClick={() => onSort('usedDate')}
                  >
                    <SortIcons
                      title="사용여부"
                      order={sort.name === 'usedDate' ? sort.order : ''}
                    />
                  </TableHead>
                  {!isPartner && <TableHead className="table-th"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((pin: Pin, idx: number) => {
                  //핀 사용 여부
                  const isUsed = !!pin.usedDate;
                  // 핀 상태
                  const pinStatus = pin.orderStatus === OrderStatus.Unpaid;
                  const isDeleteButton = !isUsed && pinStatus;

                  return (
                    <TableRow
                      key={pin._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {!isPartner && (
                        <TableCell className="table-cell" data-exclude-excel>
                          {isDeleteButton && (
                            <Checkbox
                              onCheckedChange={() => handleCheck(pin._id ?? '')}
                              checked={
                                pin._id ? checkedPins.includes(pin._id) : false
                              }
                            />
                          )}
                        </TableCell>
                      )}
                      <TableCell className="table-cell" data-exclude-excel>
                        {pinData.totalItems - (pageNumber - 1) * pageSize - idx}
                      </TableCell>
                      <TableCell
                        className="table-cell font-medium"
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
                        <TableCell className="table-cell">
                          {pin.partner?.companyName}
                        </TableCell>
                      )}
                      <TableCell className="table-cell">
                        {pin.endDate &&
                          format(new Date(pin.endDate), 'yyyy. M. dd')}
                      </TableCell>
                      <TableCell className="table-cell">
                        {pin.createdAt &&
                          format(new Date(pin.createdAt), 'yyyy. M. dd')}
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
                          {isDeleteButton && (
                            // 사용중이거나, unpaid상태 일때만 삭제 버튼 노출
                            <IconDeleteButton
                              onDelete={() =>
                                handleDeletePin({
                                  id: pin._id ?? '',
                                  number: pin.number ?? '',
                                })
                              }
                            />
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
    </div>
  );
}

export const DeletePinModal = ({ number }: { number: string[] }) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-2">
        다음 {number.length}개의 Pin을 삭제하시겠습니까?
      </div>
      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
        {number.map((d, index) => (
          <div
            key={d}
            className={`
                    py-1 px-2 
                    ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    text-sm text-gray-800
                    rounded-sm
                  `}
          >
            {index + 1}. {splitFourChar(d)}
          </div>
        ))}
      </div>
      <div className="text-red-600 font-semibold text-sm">
        ⚠️ 삭제된 Pin은 복구할 수 없습니다.
      </div>
    </div>
  );
};
