'use client';

import ProductDetailInfo from './product-detail-info';
import ProductDetailReserveInfo from './product-detail-reserv-info';
import ProductDetailReserveDate from './product-detail-reserve-date';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useDetailSaleProductQuery } from '@/queries/product.queries';

export default function ProductDetailClient({ id }: { id: string }) {
  const productDetailData = useDetailSaleProductQuery(id);

  if (Object.keys(productDetailData).length < 1) {
    return false;
  }

  //회원가입하면 - 로그인한 사용자의 정보를 이용해 상품예약 세팅

  //판매 상품 아이디, 예약날짜, 예약시간, 추가된 상품,
  //예약자이름, 휴대폰 정보, 이메일, 예약확인비번
  //동의하는거

  return (
    <Form>
      <form>
        <div className="flex flex-row space-y-8">
          {/* 상품 상세 정보 */}
          <ProductDetailInfo id={id} productDetailData={productDetailData} />
          {/* 상품 예약하기 */}
          <ProductDetailReserveDate />
          {/* 상품 예약 정보 */}
          <ProductDetailReserveInfo />
        </div>
      </form>
    </Form>
  );
}
