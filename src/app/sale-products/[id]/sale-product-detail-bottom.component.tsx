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
                className="bg-white/90 border-none shadow-md hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="p-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={d.images[0]}
                      alt={d.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base lg:text-lg font-medium line-clamp-1">
                      {d.name}
                    </h3>
                  </div>
                  <ScrollArea className="h-24">
                    <div className="space-y-2 text-sm lg:text-base text-muted-foreground">
                      <p>{d.description2}</p>
                      {d.description3 && <p>{d.description3}</p>}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
