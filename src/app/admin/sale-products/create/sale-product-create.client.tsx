'use client';

import { useProductListQuery } from '../../queries';
import SaleProductForm from '../sale-product-form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ProductDisplayData } from '@/definitions';
import { useState } from 'react';

export default function SaleProductCreateClient() {
  const productData = useProductListQuery();

  const [selectProductData, setSelectProductData] = useState<
    ProductDisplayData[]
  >([]);

  if (Array.isArray(productData.list) && productData.list.length < 1) {
    return false;
  }

  const handleToggleClick = (data: ProductDisplayData) => {
    setSelectProductData((prevData): ProductDisplayData[] => {
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">상품목록</h1>
        <p className="text-sm text-gray-500">판매할 상품을 선택해주세요.</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6 space-y-6">
          <div className="min-h-[200px] max-h-[calc(100vh-400px)] overflow-y-auto rounded-md border border-gray-100">
            <div className="p-4">
              <ToggleGroup
                variant="outline"
                type="multiple"
                className="flex-wrap gap-2"
              >
                {productData.list.map((d) => {
                  return (
                    <ToggleGroupItem
                      key={d._id}
                      value={d._id}
                      onClick={() => handleToggleClick(d)}
                      className="px-4 py-2 text-sm font-medium"
                    >
                      {d.name}
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </div>
          </div>

          {selectProductData.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-900">상품 상세</h2>
                <p className="text-sm text-gray-500">
                  선택한 상품의 상세 정보를 입력해주세요.
                </p>
              </div>
              <SaleProductForm
                selectProductData={selectProductData}
                onResetData={handleResetData}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              상품을 선택해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
