'use client';

import ProductForm from '../../products/product-form';
import SaleProductCreateForm from './sale-product-create-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ProductFormData, SaleProductFormData } from '@/definitions';
import { useProductListQuery } from '@/queries/product.queries';
import { useState } from 'react';

export default function SaleProductCreateClient() {
  const productData = useProductListQuery();

  const [selectProductData, setSelectProductData] = useState<ProductFormData[]>(
    []
  );

  if (Array.isArray(productData.list) && productData.list.length < 1) {
    return false;
  }

  const handleToggleClick = (data: ProductFormData) => {
    setSelectProductData((prevData): ProductFormData[] => {
      const findData = prevData.find((f) => f._id === data._id);
      if (findData) {
        return prevData.filter((f) => f._id !== data._id);
      } else {
        return [...prevData, data];
      }
    });
  };

  const handleResetData = () => {
    setSelectProductData([]);
  };

  return (
    <div className="space-y-8">
      <h1>상품목록</h1>
      <div className="flex">
        <ToggleGroup variant="outline" type="multiple">
          {productData.list.map((d) => {
            return (
              <ToggleGroupItem
                key={d._id}
                value={d._id ?? ''}
                onClick={() => handleToggleClick(d)}
              >
                {d.name}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      {selectProductData.length > 0 && (
        <div className="space-y-8">
          <h1>상품 상세</h1>
          <SaleProductCreateForm
            selectProductData={selectProductData}
            onResetData={handleResetData}
          />

          {selectProductData.length > 0 && (
            <Tabs defaultValue={selectProductData[0]._id} className="w-full">
              <TabsList>
                {selectProductData.map((d) => {
                  return (
                    <TabsTrigger key={d._id} value={d._id ?? ''}>
                      {d.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {selectProductData.map((d) => {
                return (
                  <TabsContent key={d._id} value={d._id ?? ''}>
                    <ProductForm productId={d._id} disabled={true} />
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
}
