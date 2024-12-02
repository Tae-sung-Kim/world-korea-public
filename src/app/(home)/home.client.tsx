'use client';

import { usePagination } from '../admin/hooks/usePagination';
import ProductImage from './product-image.component';
import ProductInfo from './product-info.component';
import useNotifications from '@/hooks/useNotifications';
import { useSaleProductListQuery } from '@/queries/product.queries';
import Link from 'next/link';

export default function HomeClient() {
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {saleProductData.list.map((d, index) => {
          const { _id, name, price, products } = d;
          const images = products.map((d2) => d2.images).flat();

          return (
            <div 
              key={_id} 
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link 
                href={`/sale-products/${_id}`} 
                className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden">
                  <ProductImage url={images[0]} />
                </div>
                <ProductInfo name={name} price={price} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
