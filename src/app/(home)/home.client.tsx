'use client';

import productService from '@/services/product.service';
import { addComma } from '@/utils/number';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function HomeClient() {
  const { data } = useQuery({
    queryKey: ['product-list'],
    queryFn: () => {
      return productService.getProudctList();
    },
  });

  if (!Array.isArray(data?.list)) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-8">
      {data.list.map((d) => {
        const { _id, name, images = [], price, regularPrice, salePrice } = d;

        return (
          <div key={_id} className="flex items-center justify-center py-12">
            <div className="p-6 w-full bg-white shadow-2xl relative rounded-lg hover:-translate-y-2 hover:transition-transform hover:ease-in">
              <Link href={`/products/${_id}`}>
                <div
                  className="aspect-[5/4] relative rounded-lg"
                  style={{
                    marginTop: 'calc((3rem)* -1)',
                  }}
                >
                  {images[0] && (
                    <img
                      className="w-full h-full rounded-lg shadow-xl"
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
