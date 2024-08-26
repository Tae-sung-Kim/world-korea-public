'use client';

import { usePinsListQuery } from '../queries';
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
import { Pin } from '@/definitions/pins.type';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';

export default function PinClient() {
  const pinList = usePinsListQuery();
  const router = useRouter();

  //핀번호 4자리씩 대쉬 추가
  const splitFourChar = (pinNumber: string = '') => {
    if (pinNumber) {
      return pinNumber.replace(/(.{4})/g, '$1-').slice(0, -1);
    }
  };

  //리스트 클릭
  const handlePinListClick = (productId: string = '') => {
    router.push('products/' + productId);
  };

  return (
    <Table>
      {/* {isFetching && <TableCaption>조회 중입니다.</TableCaption>} */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">번호</TableHead>
          <TableHead className="w-[200px]">핀 번호</TableHead>
          <TableHead className="">연결 상품</TableHead>
          <TableHead className="w-[100px] text-center">종료일</TableHead>
          <TableHead className="w-[100px] text-center">생성일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pinList.map((pin: Pin, idx: number) => (
          <TableRow
            key={pin._id}
            className="cursor-pointer"
            onClick={() => handlePinListClick(pin.product?._id)}
          >
            <TableCell>{idx + 1}</TableCell>
            <TableCell className="font-medium">
              {splitFourChar(pin.number)}
            </TableCell>
            <TableCell>{pin.product?.name}</TableCell>
            <TableCell className="text-right">
              {new Date(pin.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              {new Date(pin.createdAt ?? '').toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>총 상품</TableCell>
          <TableCell className="text-right">
            {addComma(pinList.length)} 개
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
