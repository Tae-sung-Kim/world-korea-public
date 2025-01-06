'use client';

import { useUpdatePartnerMutation } from '@/app/admin/queries';
import DetailTitle from '@/app/components/common/detail-title.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ProductDisplayData } from '@/definitions';
import productService from '@/services/product.service';
import userService from '@/services/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiDeleteBin6Line } from 'react-icons/ri';
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

  console.log('userId', userId);

  const [partnerProducts, setPartnerProducts] = useState<ProductDisplayData[]>(
    []
  );

  // 상품조회(판매 상품이 아님)
  const [productData, setProductData] = useState<ProductDisplayData[]>([]);

  const handleToggleClick = (data: ProductDisplayData) => {
    setPartnerProducts((prevData): ProductDisplayData[] => {
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
    <>
      <DetailTitle title="파트너 상세" />

      <Form {...partnerForm}>
        <form onSubmit={partnerForm.handleSubmit(handleSubmit)}>
          <Card>
            {/* <CardHeader>
              <CardTitle>파트너 수정</CardTitle>
            </CardHeader> */}
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <FormField
                  control={partnerForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        업체명
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="업체명을 입력하세요"
                          {...field}
                          disabled
                          readOnly
                          value={field.value ?? ''}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={partnerForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        주소
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="주소를 입력하세요"
                          {...field}
                          value={field.value ?? ''}
                          {...isReadOnly}
                          className="w-full"
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
                      <FormLabel className="text-sm font-medium">
                        연락처
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="연락처를 입력하세요"
                          {...field}
                          value={field.value ?? ''}
                          {...isReadOnly}
                          className="w-full"
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
                      <FormLabel className="text-sm font-medium">
                        이름
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="이름을 입력하세요"
                          {...field}
                          value={field.value ?? ''}
                          {...isReadOnly}
                          className="w-full"
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
                      <FormLabel className="text-sm font-medium">
                        휴대폰
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="휴대폰 번호를 입력하세요"
                          {...field}
                          value={field.value ?? ''}
                          {...isReadOnly}
                          className="w-full"
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
                      <FormLabel className="text-sm font-medium">
                        이메일
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="이메일을 입력하세요"
                          {...field}
                          value={field.value ?? ''}
                          {...isReadOnly}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">상품 리스트</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {productData.map((d) => {
                        const isSelected = partnerProducts
                          .map((d) => d._id)
                          .includes(d._id);

                        const isUsed = !!d.partner && d.partner !== userId;

                        return (
                          <Button
                            key={d._id}
                            type="button"
                            value={d._id ?? ''}
                            disabled={isUsed}
                            variant={isSelected ? 'secondary' : 'outline'}
                            onClick={() => handleToggleClick(d)}
                            className={`
                              h-auto px-3 py-4 justify-start text-left
                              ${
                                isSelected
                                  ? 'border-primary bg-primary/10'
                                  : 'hover:border-primary/50'
                              }
                            `}
                          >
                            {d.name}
                            {isUsed && (
                              <span className="icon-badge ml-2 bg-pink-100 text-pink-800">
                                사용중
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-xs text-primary ml-2">
                                선택됨
                              </span>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      선택된 상품
                      {partnerProducts.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          ({partnerProducts.length}개 선택됨)
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {partnerProducts.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        선택된 상품이 없습니다
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {partnerProducts.map((d) => (
                          <Badge
                            key={d._id}
                            variant="secondary"
                            className="text-sm bg-background hover:bg-background"
                          >
                            {d.name}
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => handleToggleClick(d)}
                              className="hover:text-destructive"
                            >
                              <RiDeleteBin6Line className="icon-delete" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="form-button-area">
                <Button type="submit" variant="submit" className="px-6">
                  수정하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}
