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

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <div className="w-full lg:w-1/2 backdrop-blur-md bg-white/70 rounded-xl p-8 shadow-lg transition-all duration-300 hover:bg-white/80">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-center items-center">
          <Carousel className="w-full max-w-md" setApi={setApi}>
            <CarouselContent>
              {images.map((d) => (
                <CarouselItem key={String(d)}>
                  <div className="aspect-square w-full p-2">
                    <Image
                      className="w-full h-full object-contain rounded-2xl transition-transform duration-300 hover:scale-105"
                      alt="상품 이미지"
                      width={500}
                      height={500}
                      src={String(d) ?? ''}
                      priority
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -translate-x-4 bg-white/80 hover:bg-white shadow-md border-none transition-all duration-200 hover:scale-110" />
            <CarouselNext className="hidden md:flex translate-x-4 bg-white/80 hover:bg-white shadow-md border-none transition-all duration-200 hover:scale-110" />
          </Carousel>
        </div>

        {/* 썸네일 갤러리 */}
        <div className="space-y-4">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-3 p-2">
              {images.map((d, index) => (
                <div
                  key={String(d)}
                  className="w-[100px] shrink-0 aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                  onClick={() => scrollTo(index)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
                  <Image
                    className="w-full h-full object-cover"
                    alt={`상품 이미지 ${index + 1}`}
                    width={100}
                    height={100}
                    src={String(d) ?? ''}
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="bg-secondary" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
