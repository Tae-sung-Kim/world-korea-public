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
  title,
}: {
  images: string[];
  title: string;
}) {
  const [api, setApi] = useState<CarouselApi>();

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <article className="w-full lg:w-1/2 bg-white/60 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100">
      <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6">
        {title}
      </h1>

      {/* 메인 이미지 캐러셀 */}
      <div className="relative w-full mb-8 px-12">
        <Carousel className="w-full max-w-xl mx-auto" setApi={setApi}>
          <CarouselContent>
            {images.map((d) => (
              <CarouselItem key={String(d)}>
                <figure className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50">
                  <Image
                    className="object-contain transition-all duration-500 hover:scale-105"
                    alt="상품 이미지"
                    src={String(d) ?? ''}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    quality={100}
                  />
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-10 h-10 rounded-full border border-gray-100" />
          <CarouselNext className="hidden md:flex -right-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-10 h-10 rounded-full border border-gray-100" />
        </Carousel>
      </div>

      {/* 썸네일 갤러리 */}
      <ScrollArea className="w-full whitespace-nowrap rounded-xl bg-gray-50/50 p-4">
        <nav className="flex w-max space-x-3">
          {images.map((d, index) => (
            <button
              key={String(d)}
              className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden cursor-pointer group ring-1 ring-gray-200 hover:ring-2 hover:ring-primary/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => scrollTo(index)}
            >
              <Image
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                alt={`상품 이미지 ${index + 1}`}
                src={String(d) ?? ''}
                fill
                sizes="80px"
                quality={80}
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
            </button>
          ))}
        </nav>
        <ScrollBar orientation="horizontal" className="bg-gray-200/50" />
      </ScrollArea>
    </article>
  );
}
