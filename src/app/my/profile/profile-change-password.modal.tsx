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
import { ModalContent, ModalHeader } from '@/components/ui/modal';
import userService from '@/services/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface PropsType {
  id?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^;&%=+\-<>\\]).{4,}$/;

const passwordSchema = () => {
  return z
    .string()
    .min(4, {
      message: '비밀번호는 영문/숫자/특수문자 조합으로 4~15자리 입니다.',
    })
    .max(15, {
      message: '비밀번호는 영문/숫자/특수문자 조합으로 8~15자리 입니다.',
    });
  // .regex(passwordRegex, {
  //   message: '특수문자 중 ; & % = - + < > ＼ 는 사용할 수 없습니다.',
  // });
};

const FormSchema = z
  .object({
    currentPassword: passwordSchema(),
    newPassword: passwordSchema(),
    newPasswordCheck: passwordSchema(),
  })
  .refine((data) => data.newPassword === data.newPasswordCheck, {
    path: ['newPasswordCheck'],
    message: '비밀번호가 일치하지 않습니다.',
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ['newPassword'],
    message: '현재 비밀번호와 새 비밀번호는 같을 수 없습니다.',
  });

export default function ProfileChangePasswordModal({
  onOk,
  onCancel,
}: PropsType) {
  //확인

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordCheck: '',
    },
  });

  const changePasswordMutate = useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => userService.changePassword(currentPassword, newPassword),
    onSuccess: (result) => {
      if (result) {
        onOk && onOk();
        toast.success('비밀번호 변경이 완료 되었습니다.');
      }
    },
    onError: (error) => {
      toast.error('비밀번호 변경중 오류가 발생하였습니다. 다시 시도해 주세요.');
    },
  });

  const handleSubmit = async () => {
    const { currentPassword, newPassword } = form.getValues();

    changePasswordMutate.mutate({ currentPassword, newPassword });
  };

  return (
    <>
      <ModalHeader>
        <div className="flex justify-center">
          <h1 className="text-xl ">비밀번호 변경</h1>
          <div className="absolute right-0">
            <Button onClick={onCancel}>X</Button>
          </div>
        </div>
      </ModalHeader>
      <ModalContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>현재 비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새로운 비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 확인해야함. */}
            <FormField
              control={form.control}
              name="newPasswordCheck"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새로운 비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center border-t-2 border-soild pt-4">
              <Button type="submit">변경하기</Button>
            </div>
          </form>
        </Form>
      </ModalContent>
    </>
  );
}
