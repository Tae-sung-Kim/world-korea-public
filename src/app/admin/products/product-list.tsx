'use client';

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
import {
  PRODUCT_STATUS_MESSAGE,
  ProductFormData,
  UserCategoryType,
} from '@/definitions';
import { addComma } from '@/utils/number';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

const columns: ColumnDef<ProductFormData>[] = [
  {
    accessorKey: 'no',
    header: '번호',
  },
  {
    accessorKey: 'name',
    header: '상품명',
  },
  {
    accessorKey: 'accessLevel',
    header: 'Level',
  },
  {
    accessorKey: 'status',
    header: '상태',
  },
  {
    accessorKey: 'regularPrice',
    header: '정가',
  },
  {
    accessorKey: 'salePrice',
    header: '할인가',
  },
  {
    accessorKey: 'price',
    header: '판매가',
  },
];
type Props = {
  productList: ProductFormData[];
  userCategoryList: UserCategoryType[] | undefined;
};

export default function ProductList({ productList, userCategoryList }: Props) {
  const router = useRouter();

  const dataTable = useReactTable({
    data: productList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  //테이블 리스트 클릭 -> 상세
  const handleProductItemClick = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  return (
    <Table>
      {/* {isFetching && <TableCaption>조회 중입니다.</TableCaption>} */}
      <TableHeader>
        {dataTable.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {productList.map((product, idx) => (
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
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>총 상품</TableCell>
          <TableCell className="text-right">
            {addComma(productList.length)} 개
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
