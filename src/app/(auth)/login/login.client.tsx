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
        if (isPartner) {
          router.push('/partner/pins');
        } else {
          router.push('/');
        }
        setTimeout(() => {
          router.refresh();
          toast.success('로그인이 성공적으로 완료되었습니다.');
        }, 10);
      } else {
        toast.error('로그인에 실패했습니다. 입력한 정보를 다시 확인해주세요.');
      }
    } catch (error) {
      toast.error('에러가 발생하였습니다.');
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-[350px] p-4">
        <div className="rounded-lg border bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
            <p className="text-sm text-muted-foreground">
              월드코리아에 오신 것을 환영합니다
            </p>
          </div>

          <div className="grid gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>아이디</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white/50 backdrop-blur-sm"
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
                        <Input
                          className="bg-white/50 backdrop-blur-sm"
                          type="password"
                          placeholder="비밀번호를 입력해주세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-2">
                  <Button className="w-full" type="submit" variant="submit">
                    로그인
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="rounded-lg bg-white/80 backdrop-blur-sm px-2 text-muted-foreground">
                또는
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/register"
              className="text-sm text-muted-foreground hover:text-brand underline underline-offset-4"
            >
              계정이 없으신가요?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
