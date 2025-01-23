'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  url: string;
  stockCount: number;
};

export default function ProductImage({ url, stockCount }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  if (!url) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/20 backdrop-blur-sm animate-pulse rounded-xl" />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
        재고: {stockCount}개
      </div>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300 rounded-xl" />

      {/* Main image */}
      <Image
        alt="상품 이미지"
        className={`
          w-full h-full object-cover rounded-xl
          transition-all duration-500 ease-out
          group-hover:scale-105
          ${isLoading ? 'blur-sm grayscale' : 'blur-0 grayscale-0'}
        `}
        src={url}
        priority={true}
        width={800}
        height={800}
        quality={85}
        onLoad={() => setIsLoading(false)}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      {/* Bottom shadow */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 via-black/10 to-transparent rounded-xl" />
    </div>
  );
}
