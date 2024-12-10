'use client';

import ProductImage from './sale-product-image.component';
import ProductInfo from './sale-product-info.component';
import { PackageDetailName, SaleProductFormData } from '@/definitions';
import Link from 'next/link';

interface ProductGridProps {
  products: SaleProductFormData<PackageDetailName>[];
}

export default function SaleProductList({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {products.map((d, index) => {
        const { _id, name, price, products } = d;
        const images = products.map((d2) => d2.images).flat();

        return (
          <div
            key={_id}
            className="group animate-fade-up backdrop-blur-sm bg-white/5"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Link
              href={`/sale-products/${_id}`}
              className="block overflow-hidden rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <div className="aspect-square w-[95%] mx-auto mt-3 overflow-hidden rounded-xl">
                  <ProductImage url={images[0]} />
                </div>
                <ProductInfo name={name} price={price} />
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
