'use client';

import SortIcons from '../components/sort-icons.component';
import { usePagination } from '../hooks/usePagination';
import useSort, { SortOrder } from '../hooks/useSort';
import {
  useDeleteProductMutation,
  useSaleProductListQuery,
  useUserCategoryListQuery,
} from '../queries';
import SaleProductSearch from './sale-product-search.component';
import Pagination from '@/app/components/common/pagination';
import TotalCountBottom from '@/app/components/common/total-count-bottom.component';
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
import React, { useMemo, useState } from 'react';
import { RiDeleteBin6Line, RiArrowDownSLine } from 'react-icons/ri';

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

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="content-search-container">
      <div className="flex mb-4">
        <SaleProductSearch />
      </div>
      <div className="list-container flex flex-col">
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-auto">
            <div className="overflow-x-auto min-w-full">
              <Table className="min-w-[1000px] w-full">
                <TableHeader className="table-header">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="table-th w-[50px] text-center">
                      번호
                    </TableHead>
                    <TableHead
                      className="table-th w-[180px] text-center cursor-pointer"
                      onClick={() => handleSortClick('name')}
                    >
                      <SortIcons
                        title="판매 상품명"
                        order={sortColumn === 'name' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="table-th min-w-[250px] text-center">
                      상세 상품명
                    </TableHead>
                    <TableHead className="table-th w-[120px] text-center">
                      level
                    </TableHead>
                    <TableHead className="table-th w-[120px] text-center">
                      단체예약여부
                    </TableHead>
                    <TableHead
                      className="table-th w-[120px] text-center cursor-pointer"
                      onClick={() => handleSortClick('price')}
                    >
                      <SortIcons
                        title="판매가"
                        order={sortColumn === 'price' ? order : ''}
                      />
                    </TableHead>
                    <TableHead className="table-th w-[120px] text-center">
                      재고
                    </TableHead>
                    <TableHead className="table-th w-[150px] text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((data, idx) => {
                    const id = data._id ?? '';

                    return (
                      <React.Fragment key={data._id}>
                        <TableRow className="group cursor-pointer hover:bg-gray-50 transition-colors">
                          <TableCell className="table-th text-gray-700">
                            {(pageNumber - 1) * pageSize + idx + 1}
                          </TableCell>
                          <TableCell className="table-th font-medium text-gray-900">
                            {data.name}
                          </TableCell>
                          <TableCell className="table-th text-gray-700">
                            <span className="text-sm min-w-0 flex-1">
                              {data.products[0]?.name}
                              {data.products.length > 1 && (
                                <span className="text-gray-500">
                                  {` 외 ${data.products.length - 1}개`}
                                </span>
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="table-th text-gray-700">
                            {
                              userCategoryList?.find(
                                (f) => f.level === String(data.accessLevel)
                              )?.name
                            }
                          </TableCell>
                          <TableCell className="table-th text-gray-700">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                data.isReservable
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {data.isReservable ? 'Y' : 'N'}
                            </span>
                          </TableCell>
                          <TableCell className="table-th text-gray-700 text-right">
                            {addComma(data.price)} 원
                          </TableCell>
                          <TableCell className="table-th text-gray-700 text-right">
                            총{' '}
                            {addComma(
                              data.products.reduce(
                                (acc, curr) => acc + (curr.pinCount ?? 0),
                                0
                              )
                            )}
                            개
                          </TableCell>
                          <TableCell className="table-th text-center">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => toggleRow(id, e)}
                                className="flex items-center gap-1 p-1 rounded hover:bg-gray-100"
                              >
                                <span className="text-xs text-gray-500">
                                  상세정보
                                </span>
                                <RiArrowDownSLine
                                  className={`w-4 h-4 transition-transform ${
                                    expandedRows.has(id) ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                              <Button
                                type="button"
                                variant="ghost"
                                className="p-2 hover:bg-red-50"
                                onClick={() =>
                                  handleDeleteProduct({ id, title: data.name })
                                }
                              >
                                <RiDeleteBin6Line className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRows.has(id) && (
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={8} className="bg-gray-50 p-4">
                              <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                  {data.products.map((product) => (
                                    <div
                                      key={product._id}
                                      className="flex items-center justify-between px-4 py-3 bg-white rounded border border-gray-100"
                                    >
                                      <span className="text-sm text-gray-900">
                                        {product.name}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <span className="text-sm text-gray-500">
                                          재고
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">
                                          {addComma(product.pinCount ?? 0)}개
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <TotalCountBottom
          title="총 판매 상품"
          count={saleProductData.totalItems}
        />

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={saleProductData.totalPages}
          totalItems={saleProductData.totalItems}
        />
      </div>
    </div>
  );
}
