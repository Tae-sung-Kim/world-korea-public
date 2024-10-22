'use client';

import {
  useProductListQuery,
  useUpdatePartnerMutation,
  useUserCategoryListQuery,
} from '@/app/admin/queries';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ProductFormData, User } from '@/definitions';
import userService from '@/services/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface IProps {
  userId: string;
}

const PartnerFormSchema = z.object({
  userCategoryId: z.string(),
  id: z.string(),
  companyName: z.string(),
  companyNo: z.string(),
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
  isApproved: z.boolean(),
  isPartner: z.boolean(),
  partnerProducts: z.array(z.string()),
});

type PartnerFormValues = z.infer<typeof PartnerFormSchema>;
const defaultDetailData = {
  userCategoryId: '',
  id: '',
  companyNo: '',
  companyName: '',
  address: '',
  contactNumber: '',
  name: '',
  phoneNumber: '',
  email: '',
  isApproved: false,
  isPartner: false,
  partnerProducts: [],
};

export default function PartnerDetailClient({ userId }: IProps) {
  const userCategoryList = useUserCategoryListQuery();
  const updatePartner = useUpdatePartnerMutation(userId);

  const [partnerProducts, setPartnerProducts] = useState<
    ProductFormData<string>[]
  >([]);

  //상품조회(판매 상품이 아님)
  const productData = useProductListQuery();

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

  const partnerForm = useForm<PartnerFormValues>({
    resolver: zodResolver(PartnerFormSchema),
    defaultValues: !!userId
      ? async () =>
          userService.getPartnerUser(userId).then(async (res) => {
            const userData = await userService.getUserById(userId);

            return {
              ...defaultDetailData,
              ...res,
              userCategoryId: userData.userCategory?._id,
              id: userData.loginId,
            };
          })
      : defaultDetailData,
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
            name="userCategoryId"
            render={({ field }) => {
              return (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormLabel>회원 구분</FormLabel>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userCategoryList?.map((item) => {
                        return (
                          <SelectItem key={item._id} value={item._id}>
                            {item.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="grid grid-cols-2">
            <FormField
              control={partnerForm.control}
              name="isApproved"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div>
                      <FormLabel>관리자 승인</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={partnerForm.control}
              name="isPartner"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div>
                      <FormLabel>파트너 승인</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>

          <div>
            <FormLabel>파트너 상품 리스트</FormLabel>
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
          </div>
          <div>
            <FormLabel>선택된 상품</FormLabel>
            <div className="flex">
              <ToggleGroup variant="outline" type="multiple">
                {partnerProducts.map((d) => {
                  return <Badge key={d._id}>{d.name}</Badge>;
                })}
              </ToggleGroup>
            </div>
          </div>

          <FormField
            control={partnerForm.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    disabled
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={partnerForm.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>업체명</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={partnerForm.control}
            name="companyNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>업체 번호</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} value={field.value ?? ''} />
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
                <FormLabel>주소</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} value={field.value ?? ''} />
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
                  <Input placeholder="" {...field} value={field.value ?? ''} />
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
                  <Input placeholder="" {...field} value={field.value ?? ''} />
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
                  <Input placeholder="" {...field} value={field.value ?? ''} />
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
                  <Input placeholder="" {...field} value={field.value ?? ''} />
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
