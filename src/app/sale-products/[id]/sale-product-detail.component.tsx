import ProductForm from '@/app/admin/products/product-form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductFormData } from '@/definitions';

export default function SaleProductDetailsTab({
  products,
}: {
  products: ProductFormData<string>[];
}) {
  return (
    <>
      {Array.isArray(products) && products.length > 0 && (
        <Tabs defaultValue={products[0]._id}>
          <TabsList className="flex flex-row m-3">
            {products.map((d) => {
              return (
                <TabsTrigger key={d._id} value={d._id ?? ''}>
                  {d.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <Separator className="my-4" />

          {products.map((d) => {
            return (
              <TabsContent key={d._id} value={d._id ?? ''} className="m-4">
                <ProductForm productId={d._id} disabled={true} />
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </>
  );
}
