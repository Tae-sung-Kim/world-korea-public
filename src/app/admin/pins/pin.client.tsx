'use client';

import { useDeletePinMutation, usePinsListQuery } from '../queries';
import { splitFourChar } from './pin.utils';
import { Button } from '@/components/ui/button';
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

export default function PinClient() {
  const pinList = usePinsListQuery();
  const router = useRouter();

  const { openModal } = useModalContext();

  const deletePinMutation = useDeletePinMutation();

  //리스트 클릭
  const handlePinListClick = (productId: string = '') => {
    router.push('products/' + productId);
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

  return (
    <Table>
      {/* {isFetching && <TableCaption>조회 중입니다.</TableCaption>} */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">번호</TableHead>
          <TableHead className="w-[250px]">핀 번호</TableHead>
          <TableHead className="">연결 상품</TableHead>
          <TableHead className="w-[110px] text-center">종료일</TableHead>
          <TableHead className="w-[110px] text-center">생성일</TableHead>
          <TableHead className="w-[70px] text-center">사용여부</TableHead>
          <TableHead className="w-[110px] text-center">삭제</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pinList.map((pin: Pin, idx: number) => (
          <TableRow key={pin._id}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell className="font-medium">
              {splitFourChar(pin.number)}
            </TableCell>
            <TableCell
              className="cursor-pointer"
              onClick={() => handlePinListClick(pin.product?._id)}
            >
              {pin.product?.name}
            </TableCell>
            <TableCell className="text-right">
              {pin.endDate && new Date(pin.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              {pin.createdAt && new Date(pin.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-center"></TableCell>
            <TableCell className="text-center">
              <Button
                onClick={() =>
                  handleDeletePin({
                    id: pin._id ?? '',
                    number: pin.number ?? '',
                  })
                }
              >
                삭제
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>총 상품</TableCell>
          <TableCell className="text-right">
            {addComma(pinList.length)} 개
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
