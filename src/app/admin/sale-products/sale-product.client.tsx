'use client';

import SortIcons from '../components/sort-icons.component';
import { usePagination } from '../hooks/usePagination';
import useSort, { SortOrder } from '../hooks/useSort';
import { useDeleteProductMutation, useUserCategoryListQuery } from '../queries';
import { useSaleProductListQuery } from '../queries/sale-product.queries';
import SaleProductSearch from './sale-product-search.component';
import Pagination from '@/app/components/common/pagination';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { PackageDetailName, SaleProductFormData } from '@/definitions';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
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

  const data = useMemo(() => {
    return saleProductData.list;
  }, [saleProductData]);

  const [sortColumn, setSortColumn] = useState<keyof (typeof data)[0] | string>(
    ''
  );
  const [order, setOrder] = useState<SortOrder>('');

  const sortedData = useSort<SaleProductFormData<PackageDetailName>>({
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

  //유저 레벨
  const userCategoryList = useUserCategoryListQuery();

  //테이블 리스트 클릭 -> 상세
  const handleProductItemClick = (id: string = '') => {
    router.push(`/admin/sale-products/${id}`);
  };

  const deleteProductMutation = useDeleteProductMutation();

  const handleDeleteProduct = ({
    id,
    title,
  }: {
    id: string;
    title: string;
  }) => {
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
      <div className="flex">
        <SaleProductSearch />
      </div>
      <div className="overflow-x-auto">
        <Table id="saleProductExportExcelTable" className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap min-w-[70px]">번호</TableHead>
              <TableHead
                className="whitespace-nowrap cursor-pointer"
                onClick={() => handleSortClick('name')}
              >
                <SortIcons
                  title="판매 상품명"
                  order={sortColumn === 'name' ? order : ''}
                />
              </TableHead>
              <TableHead className="whitespace-nowrap min-w-[100px]">상세 상품명</TableHead>
              <TableHead className="whitespace-nowrap min-w-[80px]">level</TableHead>
              <TableHead className="whitespace-nowrap min-w-[80px]">단체예약여부</TableHead>
              <TableHead
                className="whitespace-nowrap min-w-[100px] text-right cursor-pointer"
                onClick={() => handleSortClick('price')}
              >
                <SortIcons
                  title="판매가"
                  order={sortColumn === 'price' ? order : ''}
                />
              </TableHead>
              <TableHead className="whitespace-nowrap min-w-[100px] text-right">재고</TableHead>
              <TableHead className="whitespace-nowrap min-w-[70px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((data, idx) => {
              return (
                <TableRow
                  key={data._id}
                  className="cursor-pointer"
                  onClick={() => handleProductItemClick(data._id)}
                >
                  <TableCell>{(pageNumber - 1) * pageSize + idx + 1}</TableCell>
                  <TableCell className="font-medium">{data.name}</TableCell>
                  <TableCell className="">
                    {data.products.map((d) => {
                      return (
                        <div key={d._id}>
                          {d.name}
                          <Separator />
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell>
                    {
                      userCategoryList?.find(
                        (f) => f.level === String(data.accessLevel)
                      )?.name
                    }
                  </TableCell>
                  <TableCell>{data.isReservable ? 'Y' : 'N'}</TableCell>
                  <TableCell className="text-right">
                    {addComma(data.price)} 원
                  </TableCell>
                  <TableCell className="text-right">
                    {data.products.map((d) => {
                      return (
                        <div key={d._id}>
                          {d.name} : {addComma(d.pinCount ?? 0)} 개
                          <Separator />
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={(e: FormEvent<HTMLButtonElement>) =>
                        handleDeleteProduct({
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
              <TableCell colSpan={7}>총 상품</TableCell>
              <TableCell className="text-right">
                {addComma(saleProductData.totalItems)} 개
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className="mt-4">
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={saleProductData.totalPages}
        />
      </div>
    </>
  );
}
