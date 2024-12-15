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
import authService from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
      await authService.register(values);
      toast.success('회원가입이 성공적으로 완료되었습니다.');
      router.push('/login');
    } catch (error: any) {
      toast.error('에러가 발생하였습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-2 text-sm text-gray-600">
            월드코리아의 파트너가 되어주세요
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 space-y-8">
            {/* 계정 정보 섹션 */}
            <div className="space-y-6 bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">계정 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">아이디</FormLabel>
                      <FormControl>
                        <Input
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="아이디를 입력해주세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">비밀번호</FormLabel>
                      <FormControl>
                        <Input
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="비밀번호를 입력해주세요"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">비밀번호 확인</FormLabel>
                      <FormControl>
                        <Input
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="비밀번호를 다시 입력해주세요"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 업체 정보 섹션 */}
            <div className="space-y-6 bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">업체 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">업체명</FormLabel>
                      <FormControl>
                        <Input
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="업체명을 입력해주세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">업체 연락처</FormLabel>
                      <FormControl>
                        <Input
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="업체 연락처를 입력해주세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">주소</FormLabel>
                        <FormControl>
                          <Input
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="업체 주소를 입력해주세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* 담당자 정보 섹션 */}
            <div className="space-y-6 bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">담당자 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">이름</FormLabel>
                      <FormControl>
                        <Input
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="담당자 이름을 입력해주세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">휴대폰</FormLabel>
                      <FormControl>
                        <Input
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="휴대폰 번호를 입력해주세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">이메일</FormLabel>
                      <FormControl>
                        <Input
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="이메일 주소를 입력해주세요"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Link
                className="text-sm text-primary hover:text-primary/80 transition-colors"
                href={'/login'}
              >
                이미 계정이 있으신가요?
              </Link>
              <Button
                type="submit"
                className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                회원가입
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
