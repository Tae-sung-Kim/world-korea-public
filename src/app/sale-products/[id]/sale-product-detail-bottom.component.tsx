import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductDisplayData } from '@/definitions';
import Image from 'next/image';

export default function SaleProductDetailBottom({
  productList,
}: {
  productList: ProductDisplayData[];
}) {
  return (
    <div className="space-y-6 lg:space-y-8">
      {Array.isArray(productList) && (
        <div className="backdrop-blur-md bg-white/70 rounded-xl p-6 lg:p-8 shadow-lg transition-all duration-300">
          <h2 className="text-lg lg:text-xl font-semibold mb-6">상품 상세</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {productList.map((d) => (
              <Card
                key={d._id}
                className="group bg-gray-50/80 hover:bg-white/90 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden rounded-2xl"
              >
                <CardHeader className="p-6">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-white/80 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Image
                      src={d.images[0]}
                      alt={d.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>
                </CardHeader>
                <CardContent className="relative p-6 pt-0">
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base lg:text-lg font-medium line-clamp-1 text-gray-800">
                        {d.name}
                      </h3>
                    </div>
                    <ScrollArea className="h-24 pr-4">
                      <div className="space-y-2 text-sm lg:text-base text-gray-600">
                        <p>{d.description2}</p>
                        {d.description3 && <p>{d.description3}</p>}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
