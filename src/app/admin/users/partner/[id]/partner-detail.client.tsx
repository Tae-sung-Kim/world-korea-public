'use client';

import { useUpdatePartnerMutation } from '@/app/admin/queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductFormData } from '@/definitions';
import productService from '@/services/product.service';
import userService from '@/services/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface IProps {
  userId: string;
}

const PartnerFormSchema = z.object({
  companyName: z.string(),
  address: z.string(),
  contactNumber: z.string(),
  name: z
    .string()
    .min(2, {
      message: '3자 이상 입력해주세요.',
    })
    .max(20, {
      message: '20자를 초과할 수 없습니다.',
    }),
  phoneNumber: z.string(),
  email: z.string().email('유효하지 않은 이메일 입니다.'),
  partnerProducts: z.array(z.string()),
});

type PartnerFormValues = z.infer<typeof PartnerFormSchema>;
const defaultDetailData = {
  companyName: '',
  address: '',
  contactNumber: '',
  name: '',
  phoneNumber: '',
  email: '',
  partnerProducts: [],
};

export default function PartnerDetailClient({ userId }: IProps) {
  const updatePartner = useUpdatePartnerMutation(userId);

  const [partnerProducts, setPartnerProducts] = useState<
    ProductFormData<string>[]
  >([]);

  // 상품조회(판매 상품이 아님)
  const [productData, setProductData] = useState<ProductFormData<string>[]>([]);

  const handleToggleClick = (data: ProductFormData<string>) => {
    setPartnerProducts((prevData): ProductFormData<string>[] => {
      const findData = prevData.find((f) => f._id === data._id);
      if (findData) {
        return prevData.filter((f) => f._id !== data._id);
      } else {
        return [...prevData, data];
      }
    });
  };

  const _setProductData = async () => {
    const productData = await productService.getProudctList();

    const listData = productData.list;
    setProductData(listData);

    return listData;
  };

  const isReadOnly = useMemo(() => {
    return {
      disabled: !!userId,
      readOnly: !!userId,
    };
  }, [userId]);

  const partnerForm = useForm<PartnerFormValues>({
    resolver: zodResolver(PartnerFormSchema),
    defaultValues: !!userId
      ? async () =>
          userService.getPartnerUser(userId).then(async (res) => {
            const userData = await userService.getUserById(userId);
            const listData = await _setProductData();

            const partnerProducts = listData.filter((f) =>
              res.partnerProducts?.includes(f._id ?? '')
            );

            setPartnerProducts(partnerProducts);

            return {
              ...defaultDetailData,
              ...res,
              userCategoryId: userData.userCategory?._id,
              id: userData.loginId,
            };
          })
      : async () => {
          await _setProductData();

          return defaultDetailData;
        },
  });

  const handleSubmit = () => {
    updatePartner.mutate({
      ...partnerForm.getValues(),
      partnerProducts: partnerProducts.map((d) => d._id ?? ''),
    });
  };

  return (
    <div className="container">
      <Form {...partnerForm}>
        <form
          onSubmit={partnerForm.handleSubmit(handleSubmit)}
          className="space-y-8"
        >
          <h1 className="text-2xl font-semibold">파트너 수정</h1>

          <FormField
            control={partnerForm.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>업체명</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    disabled
                    readOnly
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2">
            <div>
              <Label>파트너 상품 리스트</Label>
              <div>
                {productData.map((d) => {
                  return (
                    <Button
                      key={d._id}
                      type="button"
                      value={d._id ?? ''}
                      className="m-1"
                      variant={
                        partnerProducts.map((d) => d._id).includes(d._id)
                          ? 'secondary'
                          : 'outline'
                      }
                      onClick={() => handleToggleClick(d)}
                    >
                      {d.name}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>선택된 상품</Label>
              <div>
                {partnerProducts.map((d) => {
                  return <Badge key={d._id}>{d.name}</Badge>;
                })}
              </div>
            </div>
          </div>

          <FormField
            control={partnerForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주소</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    value={field.value ?? ''}
                    {...isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={partnerForm.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>연락처</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    value={field.value ?? ''}
                    {...isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={partnerForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    value={field.value ?? ''}
                    {...isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={partnerForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>휴대폰</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    value={field.value ?? ''}
                    {...isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={partnerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    value={field.value ?? ''}
                    {...isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="ml-2">
            수정하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
