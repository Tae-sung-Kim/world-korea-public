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
import { useToast } from '@/components/ui/use-toast';
import authService from '@/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  password: z.string(),
});

export default function SignInClient() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: '',
      password: '',
    },
  });
  const signInMutatino = useMutation({ mutationFn: authService.signIn });

  const handleSubmit = async () => {
    console.log('?');
    try {
      // const response = await signInMutatino.mutateAsync(form.getValues());
      // const response = await signInMutatino.mutateAsync(form.getValues());

      const response = await signIn('credentials', {
        ...form.getValues(),
        redirect: false,
      });

      if (response.ok) {
        toast({
          title: '로그인이 성공적으로 완료되었습니다.',
        });
        router.replace('/');
      } else {
        toast({
          title: '로그인에 실패했습니다. 입력한 정보를 다시 확인해주세요.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-1/2 space-y-6"
        >
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
          <Button type="submit">로그인</Button>
        </form>
      </Form>
    </>
  );
}
