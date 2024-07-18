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
import userService from '@/services/userService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
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
});

export default function EditProfileClient() {
  const { isFetching, data: currentUserData } = useQuery({
    queryKey: ['userService.getCurrentUser'],
    queryFn: userService.getCurrentUser,
  });

  const patchMutation = useMutation({
    mutationFn: userService.patchUser,
    onSuccess: () => {
      toast.success('정보 수정이 완료 되었습니다.');
    },
    onError: () => {
      toast.error('정보 수정이 실패 하였습니다. 잠시 후 다시 시도하여 주세요.');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      companyNo: '',
      companyName: '',
      address: '',
      contactNumber: '',
      name: '',
      phoneNumber: '',
      email: '',
    },
  });

  const handleSubmit = () => {
    const { companyName, address, contactNumber, name, phoneNumber, email } =
      form.getValues();

    patchMutation.mutate({
      _id: currentUserData?._id,
      companyName,
      address,
      contactNumber,
      name,
      phoneNumber,
      email,
    });
  };

  useEffect(() => {
    //비밀번호는 나중에

    if (currentUserData && !isFetching) {
      const {
        loginId,
        companyName,
        companyNo,
        address,
        contactNumber,
        name,
        phoneNumber,
        email,
      } = currentUserData;

      form.setValue('id', loginId);
      form.setValue('companyName', companyName);
      form.setValue('companyNo', companyNo);
      form.setValue('address', address);
      form.setValue('contactNumber', contactNumber);
      form.setValue('name', name);
      form.setValue('phoneNumber', phoneNumber);
      form.setValue('email', email);
    }
  }, [isFetching, currentUserData, form]);

  return (
    <>
      <h1 className="text-2xl font-semibold text-center p-4">정보 수정</h1>

      <div className="container">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input readOnly disabled {...field} />
                  </FormControl>
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
                    <Input placeholder="업체명을 입력해 주세요." {...field} />
                  </FormControl>
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
                    <Input
                      placeholder="업체 번호를 입력해 주세요."
                      disabled
                      {...field}
                    />
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
                    <Input placeholder="주소를 입력해 주세요." {...field} />
                  </FormControl>
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
                    <Input placeholder="연락처를 입력해 주세요." {...field} />
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
                    <Input {...field} />
                  </FormControl>
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
                    <Input
                      placeholder="휴대폰 번호를 입력해 주세요."
                      {...field}
                    />
                  </FormControl>
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
                    <Input placeholder="이메일을 입력해 주세요." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-2" disabled={isFetching}>
              수정하기
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
