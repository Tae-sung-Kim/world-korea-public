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
import { useRouter } from 'next/navigation';

type Props = {
  productList: ProductFormData[];
  userCategoryList: UserCategoryType[] | undefined;
};

export default function ProductListClient({
  productList,
  userCategoryList,
}: Props) {
  const router = useRouter();

  //테이블 리스트 클릭 -> 상세
  const handleProductItemClick = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  return (
    <Table>
      {/* {isFetching && <TableCaption>조회 중입니다.</TableCaption>} */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">번호</TableHead>
          <TableHead className="">상품명</TableHead>
          <TableHead className="">level</TableHead>
          <TableHead className="">상태</TableHead>
          <TableHead className="text-right">정가</TableHead>
          <TableHead className="text-right">할인가</TableHead>
          <TableHead className="text-right">판매가</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productList.map((product, idx) => (
          <TableRow
            key={product._id}
            className="cursor-pointer"
            onClick={() => handleProductItemClick(String(product._id))}
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
