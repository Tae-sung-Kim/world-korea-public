'use client';

import IconDeleteButton from '../components/icon-delete-button.component';
import SortIcons from '../components/sort-icons.component';
import { usePagination } from '../hooks/usePagination';
import useSort from '../hooks/useSort';
import {
  useDeleteProductMutation,
  useProductListQuery,
  useUserCategoryListQuery,
} from '../queries';
import ProductSearch from './product-search.component';
import ListWrapper from '@/app/components/common/list-wrapper.component';
import NoDataFound from '@/app/components/common/no-data-found.component';
import Pagination from '@/app/components/common/pagination.component';
import TotalCountBottom from '@/app/components/common/total-count-bottom.component';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MODAL_TYPE, useModalContext } from '@/contexts/modal.context';
import { PRODUCT_STATUS, PRODUCT_STATUS_MESSAGE } from '@/definitions';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function ProductListClient() {
  const router = useRouter();
  const { openModal } = useModalContext();

  const { pageNumber, pageSize, filter } = usePagination();
  const { sort, onSort } = useSort();

  const productData = useProductListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
    sort,
  });

  const data = useMemo(() => {
    return productData.list;
  }, [productData]);

  //유저 레벨
  const userCategoryList = useUserCategoryListQuery();

  //테이블 리스트 클릭 -> 상세
  const handleProductItemClick = (id: string = '') => {
    router.push(`/admin/products/${id}`);
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
    <div className="content-search-container">
      <div className="list-search-buttons">
        <div className="flex-1 max-w-xl">
          <ProductSearch />
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
                      className="table-th cursor-pointer w-[200px]"
                      onClick={() => onSort('name')}
                    >
                      <SortIcons
                        title="상품명"
                        order={sort.name === 'name' ? sort.order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="table-th w-[90px] cursor-pointer"
                      onClick={() => onSort('accessLevel')}
                    >
                      <SortIcons
                        title="level"
                        order={sort.name === 'accessLevel' ? sort.order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="table-th w-[90px] cursor-pointer"
                      onClick={() => onSort('status')}
                    >
                      <SortIcons
                        title="상태"
                        order={sort.name === 'status' ? sort.order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="table-th w-[100px] text-right cursor-pointer"
                      onClick={() => onSort('regularPrice')}
                    >
                      <SortIcons
                        title="정가"
                        order={sort.name === 'regularPrice' ? sort.order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="table-th w-[100px] text-right cursor-pointer"
                      onClick={() => onSort('salePrice')}
                    >
                      <SortIcons
                        title="할인가"
                        order={sort.name === 'salePrice' ? sort.order : ''}
                      />
                    </TableHead>
                    <TableHead
                      className="table-th w-[70px] text-right cursor-pointer"
                      onClick={() => onSort('pinCount')}
                    >
                      <SortIcons
                        title="재고"
                        order={sort.name === 'pinCount' ? sort.order : ''}
                      />
                    </TableHead>
                    <TableHead className="table-th w-[70px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((product, idx) => (
                    <TableRow
                      key={product._id}
                      className="transition-colors hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      <TableCell className="table-cell truncate">
                        {productData.totalItems -
                          (pageNumber - 1) * pageSize -
                          idx}
                      </TableCell>
                      <TableCell
                        className="table-cell font-medium truncate list-link"
                        onClick={() => handleProductItemClick(product._id)}
                      >
                        {product.name}
                      </TableCell>
                      <TableCell className="table-cell truncate">
                        {
                          userCategoryList?.find(
                            (f) => f.level === String(product.accessLevel)
                          )?.name
                        }
                      </TableCell>
                      <TableCell className="table-cell">
                        <span
                          className={`icon-badge truncate
                        ${
                          product.status === PRODUCT_STATUS.AVAILABLE
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        >
                          {PRODUCT_STATUS_MESSAGE[product.status]}
                        </span>
                      </TableCell>
                      <TableCell className="table-cell text-right">
                        {addComma(product.regularPrice)}
                      </TableCell>
                      <TableCell className="table-cell text-right">
                        {addComma(product.salePrice)}
                      </TableCell>
                      <TableCell className="table-cell text-right">
                        {addComma(product.pinCount)}
                      </TableCell>
                      <TableCell className="table-cell text-right">
                        <IconDeleteButton
                          onDelete={(e) => {
                            e?.stopPropagation();
                            handleDeleteProduct({
                              id: product._id,
                              title: product.name,
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ListWrapper>

            <div className="mt-4">
              <TotalCountBottom
                title="총 상품"
                count={productData.totalItems}
              />
              <Pagination
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalPages={productData.totalPages}
                totalItems={productData.totalItems}
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
