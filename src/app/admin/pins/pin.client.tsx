'use client';

import { usePagination } from '../hooks/usePagination';
import {
  useDeletePinMutation,
  usePinsListQuery,
  useProductListQuery,
  useUsedPinMutation,
} from '../queries';
import { splitFourChar } from './pin.utils';
import Pagination from '@/app/common/components/pagination';
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
import { Pin } from '@/definitions/pins.type';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function PinClient() {
  const productData = useProductListQuery();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const { pageNumber = 1, pageSize = 10 } = usePagination();

  const pinData = usePinsListQuery({
    pageNumber,
    pageSize,
  });

  const router = useRouter();

  const { openModal } = useModalContext();

  const deletePinMutation = useDeletePinMutation();

  const usedPinMutation = useUsedPinMutation();

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

  const handleUsedPin = (id: string = '', number: string = '') => {
    if (!!id) {
      return openModal({
        type: MODAL_TYPE.CONFIRM,
        title: '핀번호 사용',
        content: `${splitFourChar(number)}를 사용 하시겠습니까?`,
        onOk: () => {
          usedPinMutation.mutate(id);
        },
      });
    }
  };

  const handlePinNumberClick = (pinNumber: string = '') => {
    if (!!pinNumber) {
      return openModal({
        type: MODAL_TYPE.CONFIRM,
        title: `${splitFourChar(pinNumber)}`,
        content: (
          <div className="flex justify-center items-stretch">
            <div className="py-8">
              <QRCodeCanvas value={`${splitFourChar(pinNumber)}`} />
            </div>
          </div>
        ),
      });
    }
  };

  return (
    <>
      <div className="flex">
        <Select onValueChange={handleProductChange} value={selectedProductId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {productData.list.map((d) => {
                return (
                  <SelectItem key={d._id} value={String(d._id)}>
                    {d.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        {/* {isFetching && <TableCaption>조회 중입니다.</TableCaption>} */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">번호</TableHead>
            <TableHead className="w-[200px]">핀 번호</TableHead>
            <TableHead className="">연결 상품</TableHead>
            <TableHead className="w-[110px] text-center">업체명</TableHead>
            <TableHead className="w-[110px] text-center">종료일</TableHead>
            <TableHead className="w-[110px] text-center">생성일</TableHead>
            <TableHead className="w-[80px] text-center">사용여부</TableHead>
            <TableHead className="w-[110px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pinData.list.map((pin: Pin, idx: number) => {
            const isUsed = pin.usedDate;
            return (
              <TableRow key={pin._id}>
                <TableCell>
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
                  {pin.endDate && new Date(pin.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {pin.createdAt &&
                    new Date(pin.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    onCheckedChange={() => handleUsedPin(pin._id, pin.number)}
                    checked={!!isUsed}
                    disabled={!!isUsed}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleDeletePin({
                        id: pin._id ?? '',
                        number: pin.number ?? '',
                      })
                    }
                  >
                    <RiDeleteBin6Line />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>총 상품</TableCell>
            <TableCell className="text-right">
              {addComma(pinData.totalItems)} 개
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={pinData.totalPages}
        pageRange={2}
        minPages={5}
      />
    </>
  );
}
