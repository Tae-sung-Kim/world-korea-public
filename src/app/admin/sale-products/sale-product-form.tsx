'use client';

import { priceShcema } from '../products/product.schema';
import { useUserCategoryListQuery } from '../queries';
import {
  useCreateSaleProductMutation,
  useUpdateSaleProductMutation,
} from '../queries/sale-product.queries';
import DetailTitle from '@/app/components/common/detail-title.component';
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
import { useDetailSaleProductQuery } from '@/queries';
import { addComma, removeComma } from '@/utils/number';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
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
  taxFree: z.string(), // 면세가
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

  const defaultValues = useMemo(
    () => ({
      name: '', // 상품명
      accessLevel: '1', // 접근 레벨
      price: '0', // 판매가
      taxFree: '0', // 면세가
      products: [],
      isReservable: false,
    }),
    []
  );

  // 상품 등록 후 reset
  const handleResetForm = () => {
    onResetData && onResetData();
    saleProductForm.reset();
  };

  // 상품 생성
  const createSaleProductMutation = useCreateSaleProductMutation({
    onSuccess: handleResetForm,
  });

  // 상품 수정
  const updateSaleProductMutation = useUpdateSaleProductMutation({});

  // 상품 상세
  const detailSaleProduct = useDetailSaleProductQuery(productId);

  const regularPrice = useMemo(() => {
    const data = !!productId ? detailProducts : selectProductData ?? [];

    return data.reduce((acc: number, cur: ProductDisplayData): number => {
      return Number(acc + cur.regularPrice);
    }, 0);
  }, [selectProductData, productId, detailProducts]);

  const saleProductForm = useForm<SaleProductFormValues>({
    resolver: zodResolver(SaleProductFormSchema),
    defaultValues,
  });

  const handleSubmit = () => {
    if (!!productId) {
      updateSaleProductMutation.mutate(saleProductForm.getValues());
    } else {
      const products: string[] =
        selectProductData?.map((d) => d._id ?? '') ?? [];
      saleProductForm.setValue('products', products);

      createSaleProductMutation.mutate(saleProductForm.getValues());
    }
  };

  // 가격 입력
  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    if (!isNaN(removeComma(e.target.value))) {
      field.onChange(String(removeComma(e.target.value)));
    }
  };

  // 상품 상세 세팅
  useEffect(() => {
    if (!detailSaleProduct || Object.keys(detailSaleProduct).length < 1) {
      return;
    }

    const { products, ...other } = detailSaleProduct;

    // 상품상세 세팅
    setDetailProducts(products ?? []);

    saleProductForm.reset({
      ...other,
      accessLevel: String(other.accessLevel),
      price: String(other.price),
      taxFree: String(other.taxFree),
      products: products?.map((d) => d._id ?? ''),
    });
  }, [detailSaleProduct, saleProductForm]);

  return (
    <div className="flex flex-col max-w-[1920px] mx-auto">
      {!!productId && <DetailTitle title="판매 상품 상세" />}

      <div className="list-container p-6 overflow-y-auto">
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
                    disabled
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
              <FormField
                control={saleProductForm.control}
                name="taxFree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      면세가
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="면세가 입력해 주세요."
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

            <div className="form-button-area space-x-2">
              <Button type="submit" variant="submit">
                상품 {!!productId ? '수정' : '등록'}
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
