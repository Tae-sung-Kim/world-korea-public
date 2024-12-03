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
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1920px] mx-auto">
      <div className="flex mb-4">
        <SaleProductSearch />
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-auto">
            <div className="overflow-x-auto min-w-full">
              <Table className="min-w-[1000px] w-full">
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 w-[5%] text-center">
                      번호
                    </TableHead>
                    <TableHead
                      className="h-12 text-sm font-semibold text-gray-900 w-[18%] text-center cursor-pointer"
                      onClick={() => handleSortClick('name')}
                    >
                      <SortIcons
                        title="판매 상품명"
                        order={sortColumn === 'name' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 w-[22%] text-center">
                      상세 상품명
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 w-[12%] text-center hidden md:table-cell">
                      level
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 w-[12%] text-center hidden md:table-cell">
                      단체예약여부
                    </TableHead>
                    <TableHead
                      className="h-12 text-sm font-semibold text-gray-900 w-[13%] text-center cursor-pointer"
                      onClick={() => handleSortClick('price')}
                    >
                      <SortIcons
                        title="판매가"
                        order={sortColumn === 'price' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 w-[13%] text-center hidden md:table-cell">
                      재고
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 w-[5%] text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((data, idx) => {
                    return (
                      <TableRow
                        key={data._id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleProductItemClick(data._id)}
                      >
                        <TableCell className="p-4 text-gray-700">
                          {(pageNumber - 1) * pageSize + idx + 1}
                        </TableCell>
                        <TableCell className="p-4 font-medium text-gray-900">
                          {data.name}
                        </TableCell>
                        <TableCell className="p-4 text-gray-700">
                          {data.products.map((d) => (
                            <div key={d._id} className="flex items-center">
                              {d.name}
                              <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                              />
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="p-4 text-gray-700 hidden md:table-cell">
                          {
                            userCategoryList?.find(
                              (f) => f.level === String(data.accessLevel)
                            )?.name
                          }
                        </TableCell>
                        <TableCell className="p-4 text-gray-700 hidden md:table-cell">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              data.isReservable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {data.isReservable ? 'Y' : 'N'}
                          </span>
                        </TableCell>
                        <TableCell className="p-4 text-gray-700 text-right">
                          {addComma(data.price)} 원
                        </TableCell>
                        <TableCell className="p-4 text-gray-700 text-right hidden md:table-cell">
                          {data.products.map((d) => (
                            <div
                              key={d._id}
                              className="flex items-center justify-end"
                            >
                              {d.name} : {addComma(d.pinCount ?? 0)} 개
                              <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                              />
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="p-4 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct({
                                id: data._id ?? '',
                                title: data.name,
                              });
                            }}
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
        <div className="border-t border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
            <div className="text-sm font-medium text-gray-900">총 상품</div>
            <div className="text-sm font-medium text-gray-900">
              {addComma(saleProductData.totalItems)} 개
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={saleProductData.totalPages}
        />
      </div>
    </div>
  );
}
