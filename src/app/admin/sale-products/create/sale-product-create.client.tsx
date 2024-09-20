'use client';

import SaleProductForm from '../sale-product-form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ProductFormData } from '@/definitions';
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

      {selectProductData.length > 0 ? (
        <div className="space-y-8">
          <h1>상품 상세</h1>
          <SaleProductForm
            selectProductData={selectProductData}
            onResetData={handleResetData}
          />
        </div>
      ) : (
        <div>상품을 선택해주세요.</div>
      )}
    </div>
  );
}
