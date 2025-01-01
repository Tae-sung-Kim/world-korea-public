'use client';

import SortIcons from '../components/sort-icons.component';
import { usePagination } from '../hooks/usePagination';
import useSort, { SortOrder } from '../hooks/useSort';
import {
  useDeleteProductMutation,
  useProductListQuery,
  useUserCategoryListQuery,
} from '../queries';
import ProductSearch from './product-search.component';
import Pagination from '@/app/components/common/pagination';
import TotalCountBottom from '@/app/components/common/total-count-bottom.component';
import { Button } from '@/components/ui/button';
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
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_MESSAGE,
  ProductDisplayData,
} from '@/definitions';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function ProductListClient() {
  const router = useRouter();
  const { openModal } = useModalContext();

  const { pageNumber, pageSize, filter } = usePagination({
    queryFilters: { name: '' },
  });

  const productData = useProductListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
  });

  const data = useMemo(() => {
    return productData.list;
  }, [productData]);

  const [sortColumn, setSortColumn] = useState<keyof (typeof data)[0] | string>(
    ''
  );
  const [order, setOrder] = useState<SortOrder>('');

  const sortedData = useSort<ProductDisplayData>({
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
        <ProductSearch />
      </div>
      <div className="list-container">
        <div className="list-content-wrapper">
          <div className="absolute inset-0 overflow-auto">
            <Table>
              <TableHeader className="table-header">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="table-th whitespace-nowrap w-[70px] min-w-[70px]">
                    번호
                  </TableHead>
                  <TableHead
                    className="table-th whitespace-nowrap cursor-pointer min-w-[200px]"
                    onClick={() => handleSortClick('name')}
                  >
                    <SortIcons
                      title="상품명"
                      order={sortColumn === 'name' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="table-th whitespace-nowrap w-[90px] min-w-[90px] cursor-pointer"
                    onClick={() => handleSortClick('accessLevel')}
                  >
                    <SortIcons
                      title="level"
                      order={sortColumn === 'accessLevel' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="table-th whitespace-nowrap w-[90px] min-w-[90px] cursor-pointer"
                    onClick={() => handleSortClick('status')}
                  >
                    <SortIcons
                      title="상태"
                      order={sortColumn === 'status' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="table-th whitespace-nowrap w-[100px] min-w-[100px] text-right cursor-pointer"
                    onClick={() => handleSortClick('regularPrice')}
                  >
                    <SortIcons
                      title="정가"
                      order={sortColumn === 'regularPrice' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="table-th whitespace-nowrap w-[100px] min-w-[100px] text-right cursor-pointer"
                    onClick={() => handleSortClick('salePrice')}
                  >
                    <SortIcons
                      title="할인가"
                      order={sortColumn === 'salePrice' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="table-th whitespace-nowrap w-[70px] min-w-[70px] text-right cursor-pointer"
                    onClick={() => handleSortClick('pinCount')}
                  >
                    <SortIcons
                      title="재고"
                      order={sortColumn === 'pinCount' ? order : ''}
                    />
                  </TableHead>
                  <TableHead className="table-th whitespace-nowrap w-[70px] min-w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((product, idx) => (
                  <TableRow
                    key={product._id}
                    className="cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    onClick={() => handleProductItemClick(product._id)}
                  >
                    <TableCell className="p-4 text-gray-700 truncate">
                      {(pageNumber - 1) * pageSize + idx + 1}
                    </TableCell>
                    <TableCell className="p-4 font-medium text-gray-900 truncate">
                      {product.name}
                    </TableCell>
                    <TableCell className="p-4 text-gray-700 truncate">
                      {
                        userCategoryList?.find(
                          (f) => f.level === String(product.accessLevel)
                        )?.name
                      }
                    </TableCell>
                    <TableCell className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium truncate
                        ${
                          product.status === PRODUCT_STATUS.AVAILABLE
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {PRODUCT_STATUS_MESSAGE[product.status]}
                      </span>
                    </TableCell>
                    <TableCell className="p-4 text-right text-gray-700 truncate">
                      {addComma(product.regularPrice)}
                    </TableCell>
                    <TableCell className="p-4 text-right text-gray-700 truncate">
                      {addComma(product.salePrice)}
                    </TableCell>
                    <TableCell className="p-4 text-right text-gray-700 truncate">
                      {addComma(product.pinCount)}
                    </TableCell>
                    <TableCell className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct({
                            id: product._id,
                            title: product.name,
                          });
                        }}
                      >
                        <RiDeleteBin6Line className="delete-icon" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <TotalCountBottom title="총 상품" count={productData.totalItems} />
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={productData.totalPages}
          totalItems={productData.totalItems}
        />
      </div>
    </div>
  );
}
