'use client';

import { usePagination } from '../hooks/usePagination';
import { useDeleteProductMutation, useUserCategoryListQuery } from '../queries';
import { useSaleProductListQuery } from '../queries/sale-product.queries';
import Pagination from '@/app/common/components/pagination';
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
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function SaleProductListClient() {
  const router = useRouter();
  const { openModal } = useModalContext();

  const { pageNumber, pageSize, filter } = usePagination({
    queryFilters: { name: '' },
  });

  const saleProductData = useSaleProductListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
  });

  //유저 레벨
  const userCategoryList = useUserCategoryListQuery();

  //테이블 리스트 클릭 -> 상세
  const handleProductItemClick = (id: string = '') => {
    router.push(`/admin/sale-products/${id}`);
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
      {/* <ProductSearch /> */}
      <Table>
        {/* {isFetching && <TableCaption>조회 중입니다.</TableCaption>} */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">번호</TableHead>
            <TableHead className="">판매 상품명</TableHead>
            <TableHead className="w-[150px]">상세 상품명</TableHead>
            <TableHead className="w-[80px]">level</TableHead>
            <TableHead className="w-[100px] text-right">판매가</TableHead>
            <TableHead className="w-[70px] text-right">재고</TableHead>
            <TableHead className="w-[70px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saleProductData.list.map((data, idx) => {
            const packageDetailName = data.products.map((d) => d.name);

            return (
              <TableRow
                key={data._id}
                className="cursor-pointer"
                onClick={() => handleProductItemClick(data._id)}
              >
                <TableCell>{(pageNumber - 1) * pageSize + idx + 1}</TableCell>
                <TableCell className="font-medium">{data.name}</TableCell>
                <TableCell className="">
                  {packageDetailName.join('/')}
                </TableCell>
                <TableCell>
                  {
                    userCategoryList?.find(
                      (f) => f.level === String(data.accessLevel)
                    )?.name
                  }
                </TableCell>
                <TableCell className="text-right">
                  {addComma(data.price)} 원
                </TableCell>
                <TableCell className="text-right">
                  재고 있어야 하나?
                  {/* {addComma(data.pinCount ?? 0)} 개 */}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={(e: FormEvent<HTMLButtonElement>) =>
                      handleDeleteProduct({
                        e,
                        id: data._id ?? '',
                        title: data.name,
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
              {addComma(saleProductData.totalItems)} 개
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={saleProductData.totalPages}
      />
    </>
  );
}
