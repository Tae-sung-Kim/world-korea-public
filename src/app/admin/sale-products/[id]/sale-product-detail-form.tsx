'use client';

import ProductForm from '../../products/product-form';
import { priceShcema } from '../../products/product.schema';
import { useUserCategoryListQuery } from '../../queries';
import {
  useCreateSaleProductMutation,
  useDetailSaleProductQuery,
} from '../../queries/sale-product.queries';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductFormData } from '@/definitions';
import saleProductService from '@/services/sale-product.service';
import { addComma, removeComma } from '@/utils/number';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';

const SaleProductFormSchema = z.object({
  products: z.array(z.object({})),
  name: z.string().refine((d) => d.length > 0, {
    message: '상품명을 입력해 주세요.',
  }), // 상품명
  accessLevel: z
    .string()
    .refine((d) => d.length > 0, {
      message: '레벨을 선택해 주세요.',
    })
    .or(z.number()), // 접근 레벨

  price: priceShcema(), // 판매가
});

type SaleProductFormValues = z.infer<typeof SaleProductFormSchema>;

type Props = {
  productId: string;
};

export default function SaleProductDetailForm({ productId }: Props) {
  const userCategoryList = useUserCategoryListQuery();

  const saleDetailProductData = useDetailSaleProductQuery(productId);

  const [regularPrice, setRegularPrice] = useState(0);

  const saleProductForm = useForm<SaleProductFormValues>({
    resolver: zodResolver(SaleProductFormSchema),
    defaultValues: async () => {
      return saleProductService.detailSaleProudct(productId).then((res) => {
        const tempRegularPrice = res.products
          ? res.products.reduce((acc: number, cur: ProductFormData): number => {
              return Number(acc + cur.regularPrice);
            }, 0)
          : 0;

        setRegularPrice(tempRegularPrice);

        return res;
      });
    },
  });

  const handleSubmit = () => {
    // const products: string[] = selectProductData?.map((d) => d._id ?? '') ?? [];
    // saleProductForm.setValue('products', products);
    // const formValues = saleProductForm.getValues();
    // saleProductCreateMutation.mutate(formValues);
  };

  //가격 입력
  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    if (!isNaN(removeComma(e.target.value))) {
      field.onChange(String(removeComma(e.target.value)));
    }
  };

  return (
    <div className="space-y-8">
      <Form {...saleProductForm}>
        <form
          onSubmit={saleProductForm.handleSubmit(handleSubmit)}
          className="space-y-8"
        >
          {/* 상품명 undefined 확인 */}
          <FormField
            control={saleProductForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상품명</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="상품명을 입력해 주세요."
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={saleProductForm.control}
            name="accessLevel"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {userCategoryList?.map((d) => {
                            return (
                              <SelectItem key={d._id} value={String(d.level)}>
                                {d.name}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="grid grid-cols-3 gap-6">
            <FormItem>
              <FormLabel>정가</FormLabel>
              <FormControl>
                <Input
                  placeholder="정가를 입력해 주세요."
                  readOnly
                  value={addComma(regularPrice ?? 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={saleProductForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>판매가</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="판매가를 입력해 주세요."
                      value={addComma(field.value)}
                      onChange={(e) => handlePriceChange(e, { ...field })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button type="submit">상품 등록</Button>
          </div>
        </form>
      </Form>

      {/* saleDetailProductData.products 있을 경우는 탭으로 상세 화면 표시 */}
      {Array.isArray(saleDetailProductData.products) &&
        saleDetailProductData.products.length > 0 && (
          <Tabs
            defaultValue={saleDetailProductData.products[0]._id}
            className="w-full"
          >
            <TabsList>
              {saleDetailProductData.products.map((d) => {
                return (
                  <TabsTrigger key={d._id} value={d._id ?? ''}>
                    {d.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {saleDetailProductData.products.map((d) => {
              return (
                <TabsContent key={d._id} value={d._id ?? ''}>
                  <ProductForm productId={d._id} disabled={true} />
                </TabsContent>
              );
            })}
          </Tabs>
        )}
    </div>
  );
}
