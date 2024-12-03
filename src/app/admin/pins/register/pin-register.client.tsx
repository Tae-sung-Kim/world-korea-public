'use client';

import { useCreatePinMutation, useProductListQuery } from '../../queries';
import { excelDataToPinRegisterData } from '../pin.utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProductDisplayData } from '@/definitions';
import { PinData } from '@/definitions/pin.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const PinFormSchema = z.object({
  productId: z.string().refine((d) => !!d, {
    message: '상품을 선택해 주세요.',
  }),
  pinList: z
    .string()
    .refine((d) => d.length > 0, { message: '핀 번호를 입력해주세요' }),
});

type PinFormValues = z.infer<typeof PinFormSchema>;

type PinRegister = {
  productId: string;
  pinList: PinData[];
};

export default function PinRegisterClient() {
  const productData = useProductListQuery();

  const handleResetFormData = () => {
    pinForm.reset();
  };

  const createPinMutation = useCreatePinMutation({
    onSuccess: handleResetFormData,
  });

  const pinForm = useForm<PinFormValues>({
    resolver: zodResolver(PinFormSchema),
    defaultValues: {
      productId: '',
      pinList: '',
    },
  });

  const handleSubmit = () => {
    const formValues = pinForm.getValues();
    const data: PinRegister = {
      productId: '',
      pinList: [],
    };

    for (const [key, value] of Object.entries(formValues)) {
      if (key === 'pinList') {
        data[key] = excelDataToPinRegisterData(value);
      } else if (key === 'productId') {
        data[key] = value;
      } else {
        console.error('키가 존재 하지 않습니다.');
      }
    }
    createPinMutation.mutate(data);
  };

  useEffect(() => {
    if (Array.isArray(productData.list) && productData.list.length > 0) {
      pinForm.reset({
        productId: productData.list[0]?._id,
      });
    }
  }, [productData.list, pinForm]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">핀 번호 등록</h2>
        <Form {...pinForm}>
          <form onSubmit={pinForm.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={pinForm.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">상품 선택</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="상품을 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {productData.list.map((d: ProductDisplayData) => (
                              <SelectItem key={d._id} value={String(d._id)}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={pinForm.control}
              name="pinList"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">핀번호 등록</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[400px] resize-y"
                      placeholder="엑셀에서 복사한 핀 번호와 날짜를 붙여넣기 해주세요."
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleResetFormData}
                className="w-32"
              >
                초기화
              </Button>
              <Button 
                type="submit" 
                className="w-32"
              >
                등록하기
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
