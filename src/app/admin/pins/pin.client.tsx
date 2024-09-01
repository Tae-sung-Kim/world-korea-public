'use client';

import {
  useDeletePinMutation,
  usePinsListQuery,
  useProductListQuery,
} from '../queries';
import { splitFourChar } from './pin.utils';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type SearchParams = Record<string, number | string | undefined>;

export default function PinClient() {
  const searchParams = useSearchParams();
  const productList = useProductListQuery();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const pageNumber: number = searchParams.get('pageNumber')
    ? Number(searchParams.get('pageNumber'))
    : 1;
  const pageSize: number = searchParams.get('pageSize')
    ? Number(searchParams.get('pageSize'))
    : 10;

  const pinData = usePinsListQuery({
    pageNumber,
    pageSize,
  });

  const router = useRouter();

  const { openModal } = useModalContext();

  const deletePinMutation = useDeletePinMutation();

  //리스트 클릭
  const handlePinListClick = (productId: string = '') => {
    router.push('products/' + productId);
  };

  //페이지 번호 클릭
  const handlePageNumberClick = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);

    params.set('pageNumber', String(pageNumber));
    params.set('pageSize', String(pageSize));

    handleUpdateQuery({ pageNumber, pageSize });
  };

  const handleProductChange = (id: string) => {
    const findProduct = productList.find((f) => f._id === id);
    setSelectedProductId(id);

    handleUpdateQuery({ name: findProduct?.name });
  };

  const handleUpdateQuery = (updatedQuery: SearchParams) => {
    const params = new URLSearchParams(searchParams);

    Object.keys(updatedQuery).forEach((key) => {
      if (updatedQuery[key]) {
        params.set(key, String(updatedQuery[key]));
        // } else {
        //   params.delete(key);
      }
    });

    const queryString = params.toString();
    router.push(`pins?${queryString}`);
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
    <>
      <div className="">
        <Select onValueChange={handleProductChange} value={selectedProductId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {productList.map((d) => {
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
            <TableHead className="w-[110px] text-center">종료일</TableHead>
            <TableHead className="w-[110px] text-center">생성일</TableHead>
            <TableHead className="w-[70px] text-center">사용여부</TableHead>
            <TableHead className="w-[110px] text-center">삭제</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pinData.list.map((pin: Pin, idx: number) => (
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
              {addComma(pinData.totalItems)} 개
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {Array.from({ length: pinData.totalPages }, (_, i) => i + 1).map(
            (d) => {
              return (
                <PaginationItem key={`pagination-${d}`}>
                  <PaginationLink onClick={() => handlePageNumberClick(d)}>
                    {d}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          )}

          {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
