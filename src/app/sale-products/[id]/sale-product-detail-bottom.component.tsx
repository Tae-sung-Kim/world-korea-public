'use client';

import { ProductDisplayData } from '@/definitions';
import Image from 'next/image';

export default function SaleProductDetailBottom({
  productList,
}: {
  productList: ProductDisplayData[];
}) {
  return (
    <section className="space-y-6 lg:space-y-8">
      {Array.isArray(productList) && (
        <article className="bg-white/60 rounded-xl p-6 lg:p-8 shadow-lg border border-slate-200">
          <h2 className="text-lg lg:text-xl font-semibold mb-6">상품 상세</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((d) => (
              <article
                key={d._id}
                className="bg-white/70 rounded-lg p-4 shadow-md border border-slate-100"
              >
                <figure className="relative aspect-square mb-4">
                  <Image
                    className="object-contain"
                    src={d.images[0] ?? ''}
                    alt={d.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </figure>
                <h3 className="font-medium text-gray-900 mb-2">{d.name}</h3>
                <p className="text-sm text-gray-600">{d.description1}</p>
              </article>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
