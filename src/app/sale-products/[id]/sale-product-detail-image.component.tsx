import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useCallback, useState } from 'react';

export default function SaleProductDetailImage({
  images,
}: {
  images: string[];
}) {
  const [api, setApi] = useState<CarouselApi>();

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <article className="w-full lg:w-1/2 bg-white/60 rounded-2xl p-6 lg:p-8 shadow-lg space-y-6">
      {/* 메인 이미지 캐러셀 */}
      <div className="relative aspect-square w-full">
        <Carousel className="w-full max-w-md mx-auto" setApi={setApi}>
          <CarouselContent>
            {images.map((d) => (
              <CarouselItem key={String(d)}>
                <figure className="relative aspect-square">
                  <Image
                    className="object-contain transition-all duration-300 group-hover:scale-105"
                    alt="상품 이미지"
                    src={String(d) ?? ''}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -translate-x-6 bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 w-12 h-12 rounded-full" />
          <CarouselNext className="hidden md:flex translate-x-6 bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 w-12 h-12 rounded-full" />
        </Carousel>
      </div>

      {/* 썸네일 갤러리 */}
      <ScrollArea className="w-full whitespace-nowrap rounded-xl bg-white/70 p-4 shadow-md">
        <nav className="flex w-max space-x-4">
          {images.map((d, index) => (
            <button
              key={String(d)}
              className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
              onClick={() => scrollTo(index)}
            >
              <Image
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                alt={`상품 이미지 ${index + 1}`}
                src={String(d) ?? ''}
                fill
                sizes="96px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </nav>
        <ScrollBar orientation="horizontal" className="bg-slate-200" />
      </ScrollArea>
    </article>
  );
}
