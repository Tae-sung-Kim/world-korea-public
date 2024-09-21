'use client';

import { usePagination } from '../admin/hooks/usePagination';
import { useSaleProductListQuery } from '@/queries/product.queries';
import { addComma } from '@/utils/number';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeClient() {
  const { pageNumber, pageSize, filter } = usePagination({
    queryFilters: { name: '' },
  });

  const saleProductData = useSaleProductListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
  });

  if (!Array.isArray(saleProductData?.list)) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-8">
      {saleProductData.list.map((d) => {
        const { _id, name, price, products } = d;

        const images = products.map((d2) => d2.images);

        return (
          <div key={''} className="flex items-center justify-center py-12">
            <div className="p-6 w-full bg-white shadow-2xl relative rounded-lg hover:-translate-y-2 hover:transition-transform hover:ease-in">
              <Link href={`/products/${_id}`}>
                <div
                  className="aspect-[5/4] relative rounded-lg"
                  style={{
                    marginTop: 'calc((3rem)* -1)',
                  }}
                >
                  {images[0] && (
                    <Image
                      alt="상품 이미지"
                      className="w-full h-full rounded-lg shadow-xl"
                      priority={true}
                      width={170}
                      height={170}
                      src={String(images[0])}
                    />
                  )}
                </div>
                <div className="mt-6">
                  <div className="text-lg font-medium">{name}</div>
                  <div className="text-gray-500 mt-1 tracking-wide">
                    ₩{addComma(price)}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
