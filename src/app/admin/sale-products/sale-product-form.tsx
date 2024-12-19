'use client';

import { priceShcema } from '../products/product.schema';
import { useUserCategoryListQuery } from '../queries';
import { useCreateSaleProductMutation } from '../queries/sale-product.queries';
import DetailTitle from '@/app/components/common/detail-title.compoent';
import SaleProductDetail from '@/app/components/sale-products/sale-product-detail.component';
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
import { Switch } from '@/components/ui/switch';
import { ProductDisplayData } from '@/definitions';
import saleProductService from '@/services/sale-product.service';
import { addComma, removeComma } from '@/utils/number';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useMemo, useState } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';

const SaleProductFormSchema = z.object({
  products: z.array(z.string()),
  name: z.string().refine((d) => d.length > 0, {
    message: '상품명을 입력해 주세요.',
  }), // 상품명
  accessLevel: z.string().refine((d) => d.length > 0, {
    message: '레벨을 선택해 주세요.',
  }), // 접근 레벨
  isReservable: z.boolean(), // 단체 예약 상품 여부
  // regularPrice: z.string().optional(), // 정가
  price: priceShcema(), // 판매가
});

type SaleProductFormValues = z.infer<typeof SaleProductFormSchema>;

type Props = {
  selectProductData?: ProductDisplayData[];
  productId?: string;
  onResetData?: () => void;
};

export default function SaleProductForm({
  selectProductData,
  productId = '',
  onResetData,
}: Props) {
  const userCategoryList = useUserCategoryListQuery();

  const [detailProducts, setDetailProducts] = useState<ProductDisplayData[]>(
    []
  );
  //상품 등록 후 reset
  const handleResetForm = () => {
    onResetData && onResetData();
    saleProductForm.reset();
  };

  //상품 생성
  const saleProductCreateMutation = useCreateSaleProductMutation({
    onSuccess: handleResetForm,
  });

  const regularPrice = useMemo(() => {
    const data =
      detailProducts.length > 0 ? detailProducts : selectProductData ?? [];

    return data.reduce((acc: number, cur: ProductDisplayData): number => {
      return Number(acc + cur.regularPrice);
    }, 0);
  }, [selectProductData, detailProducts]);

  const saleProductForm = useForm<SaleProductFormValues>({
    resolver: zodResolver(SaleProductFormSchema),
    defaultValues: !!productId
      ? async () =>
          saleProductService.getDetailSaleProudct(productId).then((res) => {
            const { products, ...other } = res;

            //상품상세 세팅
            setDetailProducts(products);

            return {
              ...other,
              products: [],
            };
          })
      : {
          name: '', // 상품명
          accessLevel: '1', // 접근 레벨
          price: '0', // 판매가
          products: [],
          isReservable: false,
        },
  });

  const handleSubmit = () => {
    const products: string[] = selectProductData?.map((d) => d._id ?? '') ?? [];

    saleProductForm.setValue('products', products);
    saleProductCreateMutation.mutate(saleProductForm.getValues());
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
    <div className="flex flex-col max-w-[1920px] mx-auto">
      <DetailTitle title="판매 상품 상세" />

      <div className="flex-1 bg-white rounded-lg shadow-sm p-6 overflow-y-auto">
        <Form {...saleProductForm}>
          <form
            onSubmit={saleProductForm.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={saleProductForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    상품명
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="상품명을 입력해 주세요."
                      value={field.value ?? ''}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={saleProductForm.control}
                name="accessLevel"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">
                        Level
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {userCategoryList?.map((d) => {
                                return (
                                  <SelectItem
                                    key={d._id}
                                    value={String(d.level)}
                                  >
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

              <FormField
                control={saleProductForm.control}
                name="isReservable"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormLabel className="text-sm font-medium text-gray-900">
                          단체예약 가능
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  정가
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="정가를 입력해 주세요."
                    readOnly
                    value={addComma(regularPrice ?? 0)}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormField
                control={saleProductForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      판매가
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="판매가를 입력해 주세요."
                        value={addComma(field.value)}
                        onChange={(e) => handlePriceChange(e, { ...field })}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-6">
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                상품 {detailProducts.length > 0 ? '수정' : '등록'}
              </Button>
            </div>
          </form>
        </Form>

        {detailProducts.length > 0 && (
          <div className="mt-6">
            <SaleProductDetail products={detailProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
