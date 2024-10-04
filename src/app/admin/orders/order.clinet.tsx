'use client';

import { usePagination } from '../hooks/usePagination';
import { useOrderListQuery } from '../queries';
import OrderSearch from './order-search.component';
import Pagination from '@/app/common/components/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { addComma } from '@/utils/number';
import { useRouter } from 'next/navigation';

export default function OrderListClient() {
  const router = useRouter();

  const { pageNumber = 1, pageSize = 10 } = usePagination();

  const ordersData = useOrderListQuery({
    pageNumber,
    pageSize,
  });

  const handleOrderListClick = (productId: string = '') => {
    router.push('/sale-products/' + productId);
  };

  return (
    <>
      <OrderSearch />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">번호</TableHead>
            <TableHead className="">상품명</TableHead>
            <TableHead className="w-[120px] text-center">구매자명</TableHead>
            <TableHead className="w-[100px] text-center">구매수량</TableHead>
            <TableHead className="w-[110px] text-center">가격</TableHead>
            <TableHead className="w-[130px] text-center">구매일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersData.list.map((d, idx) => {
            return (
              <TableRow key={d._id}>
                <TableCell>
                  {ordersData.totalItems - (pageNumber - 1) * pageSize - idx}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => handleOrderListClick(d.saleProduct._id)}
                >
                  {d.saleProduct.name}
                </TableCell>
                <TableCell>{d.user && d.user.name}</TableCell>
                <TableCell className="text-right">
                  {addComma(d.quantity ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  {addComma(d.totalPrice ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  {d.orderDate && new Date(d.orderDate).toLocaleDateString()}
                </TableCell>
                {/* <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {}}
                  ></Button>
                </TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>총 구매</TableCell>
            <TableCell className="text-right">
              {addComma(ordersData.totalItems)} 개
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={ordersData.totalPages}
        pageRange={2}
        minPages={5}
      />
    </>
  );
}
