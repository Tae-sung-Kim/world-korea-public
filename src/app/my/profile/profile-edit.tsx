'use client';

import { ProfileStep } from './profile.constant';
import {
  useGetCurrentUserQuery,
  usePatchUserMutation,
} from '@/app/admin/queries';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineCheck, MdOutlineClose } from 'react-icons/md';
import { z } from 'zod';

const formSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  companyNo: z.string(),
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
});

export default function ProfileEdit({
  onStep,
}: {
  onStep: (type: ProfileStep) => void;
}) {
  const currentUserData = useGetCurrentUserQuery();

  const patchMutation = usePatchUserMutation({
    onSuccess: () => onStep(ProfileStep.Detail),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      companyNo: '',
      companyName: '',
      address: '',
      contactNumber: '',
      name: '',
      phoneNumber: '',
      email: '',
    },
  });

  const handleSubmit = () => {
    const { companyName, address, contactNumber, name, phoneNumber, email } =
      form.getValues();

    patchMutation.mutate({
      _id: currentUserData?._id,
      companyName,
      address,
      contactNumber,
      name,
      phoneNumber,
      email,
    });
  };

  useEffect(() => {
    //비밀번호는 나중에
    if (Object.keys(currentUserData).length > 0) {
      const {
        loginId,
        companyName,
        companyNo,
        address,
        contactNumber,
        name,
        phoneNumber,
        email,
      } = currentUserData;

      form.setValue('id', loginId);
      form.setValue('companyName', companyName);
      form.setValue('companyNo', companyNo);
      form.setValue('address', address);
      form.setValue('contactNumber', contactNumber);
      form.setValue('name', name);
      form.setValue('phoneNumber', phoneNumber);
      form.setValue('email', email);
    }
  }, [currentUserData, form]);

  return (
    <div>
      <div className="px-4">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  회원 정보 수정
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-500">
                          아이디
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            className="bg-gray-50 font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-500">
                          업체명
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="font-medium" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-500">
                          업체 번호
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            className="bg-gray-50 font-medium"
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
                        <FormLabel className="text-sm text-gray-500">
                          연락처
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="font-medium" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-500">
                          이름
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="font-medium" />
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
                        <FormLabel className="text-sm text-gray-500">
                          휴대폰
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="font-medium" />
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
                        <FormLabel className="text-sm text-gray-500">
                          주소
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="font-medium" />
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
                        <FormLabel className="text-sm text-gray-500">
                          이메일
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="font-medium" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 sm:pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onStep(ProfileStep.Detail)}
                  className="w-full sm:w-32 font-medium hover:bg-gray-100"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    <MdOutlineClose className="text-xl" />
                    취소
                  </span>
                </Button>
                <Button type="submit" variant="submit">
                  <span className="relative flex items-center justify-center gap-2">
                    <MdOutlineCheck className="text-xl" />
                    저장
                  </span>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
