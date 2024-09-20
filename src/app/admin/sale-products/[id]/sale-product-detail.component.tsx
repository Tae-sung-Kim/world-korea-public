import ProductForm from '../../products/product-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductFormData } from '@/definitions';

export default function SaleProductDetail({
  products,
}: {
  products: ProductFormData[];
}) {
  return (
    <>
      {Array.isArray(products) && products.length > 0 && (
        <Tabs defaultValue={products[0]._id} className="w-full">
          <TabsList>
            {products.map((d) => {
              return (
                <TabsTrigger key={d._id} value={d._id ?? ''}>
                  {d.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {products.map((d) => {
            return (
              <TabsContent key={d._id} value={d._id ?? ''}>
                <ProductForm productId={d._id} disabled={true} />
              </TabsContent>
            );
          })}
        </Tabs>
      )}
      ;
    </>
  );
}
