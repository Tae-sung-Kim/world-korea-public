'use client';

import {
  useDeleteProductMutation,
  useProductListQuery,
  useUserCategoryListQuery,
} from '../queries';
import Paginations from '@/app/common/components/paginations';
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
import { PRODUCT_STATUS_MESSAGE } from '@/definitions';
import { addComma } from '@/utils/number';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';

export default function ProductListClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal } = useModalContext();

  const pageNumber = Number(searchParams.get('pageNumber') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 5);

  const productData = useProductListQuery({ pageNumber, pageSize });

  //유저 레벨
  const userCategoryList = useUserCategoryListQuery();

  //테이블 리스트 클릭 -> 상세
  const handleProductItemClick = (id: string = '') => {
    router.push(`/admin/products/${id}`);
  };

  const deleteProductMutation = useDeleteProductMutation();

  const handleDeleteProduct = ({
    e,
    id,
    title,
  }: {
    e: FormEvent<HTMLButtonElement>;
    id: string;
    title: string;
  }) => {
    e.stopPropagation();
    if (!!id) {
      openModal({
        type: MODAL_TYPE.CONFIRM,
        title: '상품 삭제',
        content: `'${title}'을(를) 삭제 하시겠습니까?`,
        onOk: () => deleteProductMutation.mutate(id),
      });
    }
  };

  return (
    <>
      <Table>
        {/* {isFetching && <TableCaption>조회 중입니다.</TableCaption>} */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">번호</TableHead>
            <TableHead className="">상품명</TableHead>
            <TableHead className="w-[80px]">level</TableHead>
            <TableHead className="w-[90px]">상태</TableHead>
            <TableHead className="w-[100px] text-right">정가</TableHead>
            <TableHead className="w-[100px] text-right">할인가</TableHead>
            <TableHead className="w-[100px] text-right">판매가</TableHead>
            <TableHead className="w-[70px] text-right">재고</TableHead>
            <TableHead className="w-[70px] text-right">삭제</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productData.list.map((product, idx) => (
            <TableRow
              key={product._id}
              className="cursor-pointer"
              onClick={() => handleProductItemClick(product._id)}
            >
              <TableCell>{idx + 1}</TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                {
                  userCategoryList?.find(
                    (f) => f.level === String(product.accessLevel)
                  )?.name
                }
              </TableCell>
              <TableCell>{PRODUCT_STATUS_MESSAGE[product.status]}</TableCell>
              <TableCell className="text-right">
                {addComma(product.regularPrice)} 원
              </TableCell>
              <TableCell className="text-right">
                {addComma(product.salePrice)} 원
              </TableCell>
              <TableCell className="text-right">
                {addComma(product.price)} 원
              </TableCell>
              <TableCell className="text-right">
                {addComma(product.pinCount ?? 0)} 개
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  onClick={(e: FormEvent<HTMLButtonElement>) =>
                    handleDeleteProduct({
                      e,
                      id: product._id ?? '',
                      title: product.name,
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
            <TableCell colSpan={8}>총 상품</TableCell>
            <TableCell className="text-right">
              {addComma(productData.totalItems)} 개
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Paginations
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={productData.totalPages}
      />
    </>
  );
}
