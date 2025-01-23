'use client';

import {
  useUserDetailQuery,
  useUserCategoryListQuery,
  useUpdateUserMutation,
} from '../../queries';
import DetailTitle from '@/app/components/common/detail-title.component';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User } from '@/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface IProps {
  userId: string;
}

const formSchema = z.object({
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
  isAdmin: z.boolean(), // 관리자 여부
  isApproved: z.boolean(), // 회원 승인
  isPartner: z.boolean(), // 파트너 여부
});

export default function UsersDetailClient({ userId }: IProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(true);

  const userData = useUserDetailQuery(userId);
  const updateMutation = useUpdateUserMutation(userId);
  const userCategoryList = useUserCategoryListQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      isAdmin: false,
    },
  });

  const userDataRef = useRef<User>();
  userDataRef.current = userData;

  const handleSubmit = async () => {
    if (!userDataRef.current) {
      return false;
    }

    const userId = userDataRef.current._id;

    const values = form.getValues();
    updateMutation.mutate({
      userCategoryId: values.userCategoryId,
      _id: userId,
      companyName: values.companyName,
      companyNo: values.companyNo,
      address: values.address,
      contactNumber: values.contactNumber,
      name: values.name,
      phoneNumber: values.phoneNumber,
      email: values.email,
      isApproved: values.isApproved,
      isPartner: values.isPartner,
      isAdmin: values.isAdmin,
    });
  };

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      form.setValue(
        'userCategoryId',
        userData.userCategory?._id || ('' as string)
      );
      form.setValue('isApproved', userData.isApproved);
      form.setValue('id', userData.loginId as string);
      form.setValue('companyName', userData.companyName);
      form.setValue('companyNo', userData.companyNo);
      form.setValue('address', userData.address);
      form.setValue('contactNumber', userData.contactNumber);
      form.setValue('name', userData.name);
      form.setValue('phoneNumber', userData.phoneNumber);
      form.setValue('email', userData.email);
      form.setValue('isPartner', userData.isPartner);
      form.setValue('isAdmin', userData.isAdmin);

      setIsInitialLoading(false);
    }
  }, [form, userData]);

  if (isInitialLoading) {
    return null;
  }

  return (
    <div className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <DetailTitle title={`회원 ${isEdit ? '수정' : '상세'}`} />

          <FormField
            control={form.control}
            name="userCategoryId"
            render={({ field }) => {
              return (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

          <div className="grid grid-cols-3">
            <FormField
              control={form.control}
              name="isApproved"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div>
                      <FormLabel>회원 승인</FormLabel>
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
              control={form.control}
              name="isPartner"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div>
                      <FormLabel>파트너 여부</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue('isAdmin', false);
                          }

                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div>
                      <FormLabel>관리자 여부</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue('isPartner', false);
                          }
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input placeholder="" readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>업체명</FormLabel>
                <FormControl>
                  <Input placeholder="" readOnly={!isEdit} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>업체 번호</FormLabel>
                <FormControl>
                  <Input placeholder="" readOnly={!isEdit} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주소</FormLabel>
                <FormControl>
                  <Input placeholder="" readOnly={!isEdit} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>연락처</FormLabel>
                <FormControl>
                  <Input placeholder="" readOnly={!isEdit} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="" readOnly={!isEdit} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>휴대폰</FormLabel>
                <FormControl>
                  <Input placeholder="" readOnly={!isEdit} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="" readOnly={!isEdit} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="form-button-area space-x-2">
            <Button
              type="submit"
              variant="submit"
              className="ml-2"
              disabled={updateMutation.isPending}
            >
              수정하기
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
