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

      if (response?.ok) {
        toast.success('로그인이 성공적으로 완료되었습니다.');
        router.push('/');
      } else {
        toast.error('로그인에 실패했습니다. 입력한 정보를 다시 확인해주세요.');
      }
    } catch (error) {
      toast.error('에러가 발생하였습니다.');
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <h1 className="text-2xl font-semibold">로그인</h1>
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
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
                  <Input placeholder="" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link className="block text-sm underline" href={'/register'}>
            계정이 없으신가요?
          </Link>
          <Button type="submit">로그인</Button>
        </form>
      </Form>
    </>
  );
}
