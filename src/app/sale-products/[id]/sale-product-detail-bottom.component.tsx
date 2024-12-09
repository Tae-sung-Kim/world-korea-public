import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductDisplayData } from '@/definitions';
import Image from 'next/image';

export default function SaleProductDeaitlBottom({
  productList,
}: {
  productList: ProductDisplayData[];
}) {
  return (
    <>
      {Array.isArray(productList) && (
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {productList.map((d) => {
              const { images, name, description2, description3 } = d;
              return (
                <Card
                  key={d._id}
                  className="group hover:shadow-xl transition-all duration-500 rounded-xl border border-gray-100/80 bg-white/50 backdrop-blur-md hover:bg-white/70"
                >
                  {/* Main Product Image */}
                  <CardHeader className="p-0">
                    <AspectRatio
                      ratio={4 / 3}
                      className="relative overflow-hidden rounded-t-xl bg-gradient-to-b from-gray-50/30 to-gray-50/10"
                    >
                      {images[0] && (
                        <Image
                          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                          alt={`${name} 대표 이미지`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          src={String(images[0])}
                          priority
                        />
                      )}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm transition-all duration-300 group-hover:bg-white/95">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                          {name}
                        </h2>
                      </div>
                    </AspectRatio>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Additional Images Gallery */}
                    {images.length > 1 && (
                      <ScrollArea className="w-full whitespace-nowrap rounded-xl bg-gray-50/30 p-2">
                        <div className="flex space-x-4 pb-1">
                          {images.slice(1).map((img) => (
                            <div
                              key={String(img)}
                              className="shrink-0 w-[180px] rounded-xl overflow-hidden bg-white/70 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <AspectRatio ratio={4 / 3} className="relative">
                                <Image
                                  className="object-contain transition-all duration-300 hover:scale-110"
                                  alt="상품 추가 이미지"
                                  fill
                                  sizes="180px"
                                  src={String(img)}
                                />
                              </AspectRatio>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}

                    {/* Product Details */}
                    <div className="space-y-6">
                      <div className="prose max-w-none">
                        <div className="space-y-4">
                          <div className="border-l-4 border-primary/60 pl-4 rounded-sm bg-gradient-to-r from-primary/5 to-transparent">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              상품 설명
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {description2}
                            </p>
                          </div>
                          {description3 && (
                            <div className="border-l-4 border-primary/60 pl-4 mt-6 rounded-sm bg-gradient-to-r from-primary/5 to-transparent">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                추가 정보
                              </h3>
                              <p className="text-gray-600 leading-relaxed">
                                {description3}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
