'use client';

import Image from 'next/image';

type Props = {
  url: string;
};

export default function ProductImage({ url }: Props) {
  if (!url) {
    return null;
  }

  return (
    <Image
      alt="상품 이미지"
      className="w-full h-full rounded shadow-xl"
      priority={true}
      width={180}
      height={180}
      src={String(url)}
    />
  );
}
