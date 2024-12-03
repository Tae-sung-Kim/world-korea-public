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
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-t-xl" />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent transition-opacity duration-300 rounded-t-xl" />

      {/* Main image */}
      <Image
        alt="상품 이미지"
        className={`
          w-full h-full object-cover rounded-t-xl
          transition-all duration-500 ease-out
          group-hover:scale-110
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Bottom shadow */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
    </div>
  );
}
