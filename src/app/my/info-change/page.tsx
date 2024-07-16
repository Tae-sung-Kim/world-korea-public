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
import { useAuthContext } from '@/contexts/AuthContext';
import userService from '@/services/userService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

export default function My() {
  const { user } = useAuthContext();

  const userId: string = user?.id ?? '';

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

  const {
    isLoading,
    isFetching,
    isFetched,
    data: userData,
  } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUserById(userId),
  });

  console.log(userData);

  const handleSubmit = () => {
    console.log('수정');
  };
  //비밀번호는 나중에
  //업체명
  //주소
  //연락처
  //이름
  //휴대폰
  //이메일

  return (
    <>
      <h1>My 페이지</h1>
      {userData && (
        <div className="container">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <h1 className="text-2xl font-semibold">회원 수정</h1>

              <FormField
                control={form.control}
                name="id"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>회원구분</FormLabel>
                      <FormControl>
                        <Input disabled readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* <FormField
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
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>회원 구분</FormLabel>
                    <FormControl>
                      <Input placeholder="" readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
              </Button> */}
            </form>
          </Form>
        </div>
      )}
    </>
  );
}
