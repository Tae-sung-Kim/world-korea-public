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
import { IOnVerifyPassword } from '@/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  password: z.string().min(4, { message: '4자 이상 입력해주세요.' }),
});

export default function ProfileConfirmPassword({
  onVerifyPassword,
}: IOnVerifyPassword) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleSubmit = () => {
    const password = form.getValues().password;
    onVerifyPassword(password);
  };

  //비밀번호 확인 버튼 후 상세보기로 이동해야 함
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="ml-2">
          확인
        </Button>
      </form>
    </Form>
  );
}
