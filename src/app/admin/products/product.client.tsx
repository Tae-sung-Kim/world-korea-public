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
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1920px] mx-auto">
      <div className="mb-4">
        <ProductSearch />
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <div className="relative h-full flex flex-col">
          <div className="absolute inset-0 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[70px] min-w-[70px]">
                    번호
                  </TableHead>
                  <TableHead
                    className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap cursor-pointer min-w-[200px]"
                    onClick={() => handleSortClick('name')}
                  >
                    <SortIcons
                      title="상품명"
                      order={sortColumn === 'name' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[90px] min-w-[90px] cursor-pointer"
                    onClick={() => handleSortClick('accessLevel')}
                  >
                    <SortIcons
                      title="level"
                      order={sortColumn === 'accessLevel' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[90px] min-w-[90px] cursor-pointer"
                    onClick={() => handleSortClick('status')}
                  >
                    <SortIcons
                      title="상태"
                      order={sortColumn === 'status' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[100px] min-w-[100px] text-right cursor-pointer"
                    onClick={() => handleSortClick('regularPrice')}
                  >
                    <SortIcons
                      title="정가"
                      order={sortColumn === 'regularPrice' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[100px] min-w-[100px] text-right cursor-pointer"
                    onClick={() => handleSortClick('salePrice')}
                  >
                    <SortIcons
                      title="할인가"
                      order={sortColumn === 'salePrice' ? order : ''}
                    />
                  </TableHead>
                  <TableHead
                    className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[70px] min-w-[70px] text-right cursor-pointer"
                    onClick={() => handleSortClick('pinCount')}
                  >
                    <SortIcons
                      title="재고"
                      order={sortColumn === 'pinCount' ? order : ''}
                    />
                  </TableHead>
                  <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[70px] min-w-[70px]" />
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
                        <RiDeleteBin6Line className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-auto sticky bottom-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1)]">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    총 상품
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-primary">
                    {addComma(productData.totalItems)}
                  </span>
                  <span className="text-sm font-medium text-gray-600">개</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={productData.totalPages}
      />
    </div>
  );
}
