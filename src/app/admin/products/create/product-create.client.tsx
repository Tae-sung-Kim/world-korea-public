'use client';

import { descriptionShcema, priceShcema } from '../product.schema';
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
import { PRODUCT_STATUS_MESSAGE } from '@/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

const ProductFormSchema = z.object({
  name: z.string().refine((d) => d.length > 0, {
    message: '상품명을 입력해 주세요.',
  }), // 상품명
  accessLevel: z.string().refine((d) => d.length > 0, {
    message: '레벨을 선택해 주세요.',
  }), // 접근 레벨
  status: z.enum(Object.keys(PRODUCT_STATUS_MESSAGE) as [string, ...string[]], {
    message: '상태를 선택해 주세요.',
  }), // 상품 상태
  images: z.array(
    z.object({
      file: z.instanceof(File),
    })
  ), // 상품 이미지
  regularPrice: priceShcema(), // 정가
  salePrice: priceShcema(), // 할인가
  price: priceShcema(), // 판매가
  description1: descriptionShcema(),
  description2: descriptionShcema(),
  description3: descriptionShcema(),
  description4: descriptionShcema(),
  unavailableDates: z.string().array().optional(), // 이용 불가능 날짜
});

type ProductFormValues = z.infer<typeof ProductFormSchema>;

export default function ProductCreateClient() {
  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '', // 상품명
      accessLevel: '', // 접근 레벨
      status: '', // 상품 상태
      images: [], // 상품 이미지
      regularPrice: '0', // 정가
      salePrice: '0', // 할인가
      price: '0', // 판매가
      description1: '',
      description2: '',
      description3: '',
      description4: '',
      unavailableDates: [], // 이용 불가능 날짜
    },
  });

  const productImages = useFieldArray({
    control: productForm.control,
    name: 'images',
  });

  console.log(productImages);

  const handleSubmit = () => {
    console.log('sssss');
  };

  return (
    <Form {...productForm}>
      <form
        onSubmit={productForm.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <FormField
          control={productForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상품명</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="상품명을 입력해 주세요."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center pt-4">
          <Button type="submit">상품 등록</Button>
        </div>
      </form>
    </Form>
  );
}
