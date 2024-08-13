'use client';

import productService from '@/services/product.service';
import { addComma } from '@/utils/number';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

export default function ProductListClient() {
  const { data: productList } = useQuery({
    queryKey: ['user-productList'],
    queryFn: productService.getProudctList,
  });

  return (
    <div className="contanier">
      <h1 className="font-mono text-2xl text-center p-10">상품 목록</h1>

      <div className="grid grid-cols-4 gap-4">
        {productList?.map((d) => {
          return (
            <>
              <div>
                <Image
                  src={String(d.images[0] ?? '')}
                  width={250}
                  height={250}
                  alt="메인 이미지"
                />
              </div>
              <div>{addComma(d.regularPrice)} 원</div>
              <div>{addComma(d.salePrice)} 원</div>
              <div>{addComma(d.price)} 원</div>
            </>
          );
        })}
      </div>
    </div>
  );
}
