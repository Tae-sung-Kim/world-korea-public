'use client';

import { usePagination } from '../admin/hooks/usePagination';
import ProductImage from './product-image.component';
import ProductInfo from './product-info.component';
import useNotifications from '@/hooks/useNotifications';
import { useSaleProductListQuery } from '@/queries/product.queries';
import Link from 'next/link';

export default function HomeClient() {
  //팝업 노출
  useNotifications();

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

        const images = products.map((d2) => d2.images).flat();

        return (
          <div key={_id} className="flex items-center justify-center py-12">
            <div className="py-6 px-4 w-full bg-white shadow-2xl relative rounded hover:-translate-y-2 hover:transition-transform hover:ease-in">
              <Link href={`/sale-products/${_id}`}>
                <div
                  className="aspect-[5/4] relative rounded"
                  style={{
                    marginTop: 'calc((2.5rem)* -1)',
                  }}
                >
                  {/* <div className="absolute">
                    <div className="animate-fade">재고량 : </div>
                    <div className="animate-fade">사용량 : </div>
                  </div> */}
                  <ProductImage url={images[0]} />
                </div>
                <div className="mt-6">
                  <ProductInfo name={name} price={price} />
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
