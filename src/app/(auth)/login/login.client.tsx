'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import userService from '@/services/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const FormSchema = z.object({
  id: z
    .string()
    .min(3, {
      message: '3자 이상 입력해주세요.',
    })
    .max(20, {
      message: '20자를 초과할 수 없습니다.',
    }),
  password: z.string().min(4, { message: '4자 이상 입력해주세요.' }),
});

export default function LoginClient() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: '',
      password: '',
    },
  });

  const handleSubmit = async () => {
    try {
      const response = await signIn('credentials', {
        ...form.getValues(),
        redirect: false,
      });

      const { isPartner } = await userService.getCurrentUser();

      if (response?.ok) {
        toast.success('로그인이 성공적으로 완료되었습니다.');
        if (isPartner) {
          router.push('/partner/orders');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        toast.error('로그인에 실패했습니다. 입력한 정보를 다시 확인해주세요.');
      }
    } catch (error) {
      toast.error('에러가 발생하였습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">로그인</h1>
          <p className="mt-2 text-sm text-gray-600">
            월드코리아에 오신 것을 환영합니다
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      아이디
                    </FormLabel>
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      비밀번호
                    </FormLabel>
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
            </div>

            <div className="flex items-center justify-between">
              <Link
                className="text-sm text-primary hover:text-primary/80 transition-colors"
                href={'/register'}
              >
                계정이 없으신가요?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              로그인
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
