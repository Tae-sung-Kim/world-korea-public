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
import { z } from 'zod';

interface PropsType {
  id?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const FormSchema = z.object({
  currentPassword: z.string().min(4, { message: '4자 이상 입력해주세요.' }),
  newPassword: z.string().min(4, { message: '4자 이상 입력해주세요.' }),
});

export default function ProfileChangePasswordModal({
  id,
  onOk,
  onCancel,
}: PropsType) {
  //확인
  const handleOk = () => {};

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
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
      console.log('11111111', result);
    },
  });

  const handleSubmit = async () => {
    const { currentPassword, newPassword } = form.getValues();

    console.log(currentPassword, newPassword);
    changePasswordMutate.mutate({ currentPassword, newPassword });
  };

  return (
    <>
      <ModalHeader>
        <h1 className="text-xl flex justify-center">비밀번호 변경</h1>
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
                    <Input placeholder="" type="password" {...field} />
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
                    <Input placeholder="" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 확인해야함. */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새로운 비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">변경하기</Button>
          </form>
        </Form>
      </ModalContent>
    </>
  );
}
