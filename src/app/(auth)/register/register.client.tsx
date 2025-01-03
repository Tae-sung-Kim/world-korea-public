'use client';

import RegisterSection from './register-section.component';
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
import authService from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z
  .object({
    id: z
      .string()
      .min(3, {
        message: '3자 이상 입력해주세요.',
      })
      .max(20, {
        message: '20자를 초과할 수 없습니다.',
      }),
    password: z.string().min(4, { message: '4자 이상 입력해주세요.' }),
    confirmPassword: z.string().min(4, { message: '4자 이상 입력해주세요.' }),
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
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: '비밀번호가 일치하지 않습니다.',
        path: ['confirmPassword'],
      });
    }
  });

const StyledInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<typeof Input>
>((props, ref) => (
  <Input ref={ref} className="bg-white/50 backdrop-blur-sm" {...props} />
));
StyledInput.displayName = 'StyledInput';

export default function Register() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      address: '',
      contactNumber: '',
      name: '',
      phoneNumber: '',
      email: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast.success('회원가입이 성공적으로 완료되었습니다.');
      await authService.register(values);
      router.push('/login');
    } catch (error: any) {
      toast.error('에러가 발생하였습니다.');
    }
  };

  return (
    <div className="max-w-[960px] mx-auto p-8">
      <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">회원가입</h1>
          <p className="text-sm text-muted-foreground">
            월드코리아의 회원이 되어주세요
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <RegisterSection
              title="계정 정보"
              description="계정에 사용할 기본 정보를 입력해주세요."
            >
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>아이디</FormLabel>
                    <FormControl>
                      <StyledInput
                        placeholder="아이디를 입력해주세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <StyledInput
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <StyledInput
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </RegisterSection>

            <RegisterSection
              title="업체 정보"
              description="업체와 관련된 정보를 입력해주세요."
            >
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>업체명</FormLabel>
                    <FormControl>
                      <StyledInput
                        placeholder="업체명을 입력해주세요"
                        {...field}
                      />
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
                    <FormLabel>업체 연락처</FormLabel>
                    <FormControl>
                      <StyledInput
                        placeholder="업체 연락처를 입력해주세요"
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
                      <StyledInput
                        placeholder="업체 주소를 입력해주세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </RegisterSection>

            <RegisterSection
              title="담당자 정보"
              description="담당자와 관련된 정보를 입력해주세요."
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <StyledInput
                        placeholder="담당자 이름을 입력해주세요"
                        {...field}
                      />
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
                      <StyledInput
                        placeholder="휴대폰 번호를 입력해주세요"
                        {...field}
                      />
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
                      <StyledInput
                        type="email"
                        placeholder="이메일 주소를 입력해주세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </RegisterSection>

            <div className="flex items-center justify-between">
              <Link
                className="text-sm text-muted-foreground hover:text-brand underline underline-offset-4"
                href="/login"
              >
                이미 계정이 있으신가요?
              </Link>
              <Button type="submit">회원가입</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
