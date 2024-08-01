'use client';

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
import userCategoryService from '@/services/user-category.service';
import userService from '@/services/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
  isApproved: z.boolean(),
});

export default function UsersDetailClient({ userId }: IProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(true);
  const queryClient = useQueryClient();

  const {
    isLoading,
    isFetching,
    isFetched,
    data: userData,
  } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUserById(userId),
  });
  const updateMutation = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
      toast.success('회원 정보를 수정하였습니다.');
    },
  });
  const { data: userCategoryList, isLoading: isUserCategoriesLoading } =
    useQuery({
      queryKey: ['user-categories'],
      queryFn: userCategoryService.getUserCategoryList,
    });

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
    });
  };

  useEffect(() => {
    if (isFetched && !isFetching && userDataRef.current) {
      const userData = userDataRef.current;

      // form.setValue(
      //   'userCategory',
      //   userData.userCategory?._id || ('' as string),
      //   {
      //     shouldDirty: true,
      //   },
      // );
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

      setIsInitialLoading(false);
    }
  }, [isFetched, isFetching, form]);

  if (isLoading || isUserCategoriesLoading || isInitialLoading) {
    return null;
  }

  return (
    <div className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <h1 className="text-2xl font-semibold">
            회원 {isEdit ? '수정' : '상세'}
          </h1>

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

          <FormField
            control={form.control}
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

          <Button
            type="submit"
            className="ml-2"
            disabled={isFetching || updateMutation.isPending}
          >
            수정하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
