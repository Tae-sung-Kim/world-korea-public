'use client';

import SortIcons from '../components/sort-icons.comonent';
import { usePagination } from '../hooks/usePagination';
import useSort, { SortOrder } from '../hooks/useSort';
import {
  useDeleteProductMutation,
  useProductListQuery,
  useUserCategoryListQuery,
} from '../queries';
import ProductSearch from './product-search.component';
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
import { PRODUCT_STATUS_MESSAGE, ProductFormData } from '@/definitions';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
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

  const sortedData = useSort<ProductFormData<string>>({
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
    <>
      <ProductSearch />
      <Table>
        {/* {isFetching && <TableCaption>조회 중입니다.</TableCaption>} */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">번호</TableHead>
            <TableHead className="" onClick={() => handleSortClick('name')}>
              <SortIcons
                title="상품명"
                order={sortColumn === 'name' ? order : ''}
              />
            </TableHead>
            <TableHead
              className="w-[90px]"
              onClick={() => handleSortClick('name')}
            >
              <SortIcons
                title="level"
                order={sortColumn === 'accessLevel' ? order : ''}
              />
            </TableHead>
            <TableHead
              className="w-[90px]"
              onClick={() => handleSortClick('status')}
            >
              <SortIcons
                title="상태"
                order={sortColumn === 'status' ? order : ''}
              />
            </TableHead>
            <TableHead
              className="w-[100px] text-right"
              onClick={() => handleSortClick('regularPrice')}
            >
              <SortIcons
                title="정가"
                order={sortColumn === 'regularPrice' ? order : ''}
              />
            </TableHead>
            <TableHead
              className="w-[100px] text-right"
              onClick={() => handleSortClick('salePrice')}
            >
              <SortIcons
                title="할인가"
                order={sortColumn === 'salePrice' ? order : ''}
              />
            </TableHead>
            {/* <TableHead className="w-[100px] text-right">판매가</TableHead> */}
            <TableHead
              className="w-[70px] text-right"
              onClick={() => handleSortClick('pinCount')}
            >
              <SortIcons
                title="재고"
                order={sortColumn === 'pinCount' ? order : ''}
              />
            </TableHead>
            <TableHead className="w-[70px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((product, idx) => (
            <TableRow
              key={product._id}
              className="cursor-pointer"
              onClick={() => handleProductItemClick(product._id)}
            >
              <TableCell>{(pageNumber - 1) * pageSize + idx + 1}</TableCell>
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
              {/* <TableCell className="text-right">
                {addComma(product.price)} 원
              </TableCell> */}
              <TableCell className="text-right">
                {addComma(product.pinCount ?? 0)} 개
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={(e: FormEvent<HTMLButtonElement>) =>
                    handleDeleteProduct({
                      id: product._id ?? '',
                      title: product.name,
                    })
                  }
                >
                  <RiDeleteBin6Line />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>총 상품</TableCell>
            <TableCell className="text-right">
              {addComma(productData.totalItems)} 개
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={productData.totalPages}
      />
    </>
  );
}
