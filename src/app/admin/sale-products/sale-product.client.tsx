'use client';

import SortIcons from '../components/sort-icons.component';
import { usePagination } from '../hooks/usePagination';
import useSort, { SortOrder } from '../hooks/useSort';
import {
  useDeleteSaleProductMutation,
  useSaleProductListQuery,
  useUserCategoryListQuery,
} from '../queries';
import SaleProductSearch from './sale-product-search.component';
import ListWrapper from '@/app/components/common/list-wrapper.component';
import NoDataFound from '@/app/components/common/no-data-found.component';
import Pagination from '@/app/components/common/pagination.component';
import TotalCountBottom from '@/app/components/common/total-count-bottom.component';
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
import React, { useMemo, useState } from 'react';
import { RiDeleteBin6Line, RiArrowDownSLine } from 'react-icons/ri';

export default function SaleProductListClient() {
  const router = useRouter();
  const { openModal } = useModalContext();

  const { pageNumber, pageSize, filter } = usePagination();
  const { sort, onSort } = useSort();

  const saleProductData = useSaleProductListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
    sort,
  });

  const data = useMemo(() => {
    return saleProductData.list;
  }, [saleProductData]);

  // 유저 레벨
  const userCategoryList = useUserCategoryListQuery();

  // 판매 상품 이동
  const handleSaleProductItemClick = (id: string = '') => {
    router.push(`/admin/sale-products/${id}`);
  };

  // 상품 이동
  const handleProductItemClick = (id: string = '') => {
    router.push(`/admin/products/${id}`);
  };

  const deleteSaleProductMutation = useDeleteSaleProductMutation();

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
        onOk: () => deleteSaleProductMutation.mutate(id),
      });
    }
  };

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // 상세 정보
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
      <div className="list-search-buttons">
        <div className="flex-1 max-w-xl">
          <SaleProductSearch />
        </div>
      </div>
      <>
        {data.length > 0 ? (
          <>
            <ListWrapper>
              <Table>
                <TableHeader className="table-header">
                  <TableRow className="list-table-row">
                    <TableHead className="table-th w-[70px]">번호</TableHead>
                    <TableHead
                      className="table-th w-[180px] text-center cursor-pointer"
                      onClick={() => onSort('name')}
                    >
                      <SortIcons
                        title="판매 상품명"
                        order={sort.name === 'name' ? sort.order : ''}
                      />
                    </TableHead>
                    <TableHead className="table-th min-w-[250px] text-center">
                      상세 상품명
                    </TableHead>
                    <TableHead
                      className="table-th w-[120px] text-center cursor-pointer"
                      onClick={() => onSort('accessLevel')}
                    >
                      <SortIcons
                        title="level"
                        order={sort.name === 'accessLevel' ? sort.order : ''}
                      />
                    </TableHead>
                    <TableHead className="table-th w-[170px] text-center">
                      단체예약여부
                    </TableHead>
                    <TableHead
                      className="table-th w-[120px] text-center cursor-pointer"
                      onClick={() => onSort('price')}
                    >
                      <SortIcons
                        title="판매가"
                        order={sort.name === 'price' ? sort.order : ''}
                      />
                    </TableHead>
                    <TableHead className="table-th w-[120px] text-center">
                      재고
                    </TableHead>
                    <TableHead className="table-th w-[150px] text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((saleData, idx) => {
                    const id = saleData._id ?? '';

                    return (
                      <React.Fragment key={saleData._id}>
                        <TableRow className="group hover:bg-gray-50 transition-colors">
                          <TableCell className="table-cell text-gray-700">
                            {saleProductData.totalItems -
                              (pageNumber - 1) * pageSize -
                              idx}
                          </TableCell>
                          <TableCell
                            className="table-cell font-medium list-link"
                            onClick={() => handleSaleProductItemClick(id)}
                          >
                            {saleData.name}
                          </TableCell>
                          <TableCell className="table-cell text-gray-700">
                            <span className="text-sm min-w-0 flex-1">
                              {saleData.products[0]?.name}
                              {saleData.products.length > 1 && (
                                <span className="text-gray-500">
                                  {` 외 ${saleData.products.length - 1}개`}
                                </span>
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="table-cell text-gray-700">
                            {
                              userCategoryList?.find(
                                (f) => f.level === String(saleData.accessLevel)
                              )?.name
                            }
                          </TableCell>
                          <TableCell className="table-cell text-gray-700">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                saleData.isReservable
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {saleData.isReservable ? 'Y' : 'N'}
                            </span>
                          </TableCell>
                          <TableCell className="table-cell text-gray-700 text-right">
                            {addComma(saleData.price)} 원
                          </TableCell>
                          <TableCell className="table-cell text-gray-700 text-right">
                            총{' '}
                            {addComma(
                              saleData.products.reduce(
                                (acc, curr) => acc + (curr.pinCount ?? 0),
                                0
                              )
                            )}
                            개
                          </TableCell>
                          <TableCell className="table-cell text-center">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="ghost"
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
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                className="p-2 hover:bg-red-50"
                                onClick={() =>
                                  handleDeleteProduct({
                                    id,
                                    title: saleData.name,
                                  })
                                }
                              >
                                <RiDeleteBin6Line className="icon-delete" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRows.has(id) && (
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={8} className="bg-gray-50 p-2">
                              <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                  {saleData.products.map((product) => (
                                    <div
                                      key={product._id}
                                      className="flex items-center justify-between px-2 py-1 bg-white rounded border border-gray-100"
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        className="flex items-center gap-1 rounded hover:bg-gray-100"
                                        onClick={() =>
                                          handleProductItemClick(product._id)
                                        }
                                      >
                                        {product.name}
                                      </Button>
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
            </ListWrapper>
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
          </>
        ) : (
          <NoDataFound />
        )}
      </>
    </div>
  );
}
