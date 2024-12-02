'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  url: string;
};

export default function ProductImage({ url }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  if (!url) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="relative w-full h-full group">
      <Image
        alt="상품 이미지"
        className={`
          w-full h-full object-cover rounded-lg transition-all duration-700 ease-in-out
          group-hover:scale-105 group-hover:brightness-110
          ${isLoading ? 'blur-sm grayscale' : 'blur-0 grayscale-0'}
        `}
        priority={true}
        width={800}
        height={800}
        quality={85}
        src={String(url)}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
      )}
    </div>
  );
}
