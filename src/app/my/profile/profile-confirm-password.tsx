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
import { MdOutlineCheck } from 'react-icons/md';

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

  // 비밀번호 확인 버튼 후 상세보기로 이동해야 함
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-md mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">비밀번호 확인</h2>
                <p className="text-sm text-gray-500">
                  회원정보 수정을 위해 비밀번호를 입력해주세요.
                </p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">비밀번호</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            className="font-medium"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    className="w-full sm:w-32 font-medium bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <span className="relative flex items-center gap-2">
                      <MdOutlineCheck className="text-xl" />
                      확인
                    </span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
