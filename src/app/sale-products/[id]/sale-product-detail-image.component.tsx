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
    <div className="w-full lg:w-1/2 bg-white rounded-xl p-8 shadow-xl border border-gray-200">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-center items-center bg-gray-100 rounded-lg p-4 border border-gray-200 shadow-md">
          <Carousel className="w-full max-w-md" setApi={setApi}>
            <CarouselContent>
              {images.map((d) => (
                <CarouselItem key={String(d)}>
                  <div className="aspect-square w-full p-2">
                    <Image
                      className="w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-105 border border-gray-100 shadow-sm"
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
            <CarouselPrevious className="hidden md:flex -translate-x-6 bg-white shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200 hover:scale-110" />
            <CarouselNext className="hidden md:flex translate-x-6 bg-white shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200 hover:scale-110" />
          </Carousel>
        </div>

        {/* 썸네일 갤러리 */}
        <div className="space-y-4">
          <ScrollArea className="w-full whitespace-nowrap rounded-lg border border-gray-200 bg-gray-100 p-3 shadow-md">
            <div className="flex w-max space-x-4 p-2">
              {images.map((d, index) => (
                <div
                  key={String(d)}
                  className="w-[100px] shrink-0 aspect-square rounded-md overflow-hidden cursor-pointer group relative border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => scrollTo(index)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200" />
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
            <ScrollBar orientation="horizontal" className="bg-gray-300" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
