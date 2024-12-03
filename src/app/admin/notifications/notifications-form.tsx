'use client';

import { useCreateNotificationsMutation } from '../queries/notifications.queries';
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
import { fileToBlob } from '@/utils/file';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { FaMinus } from 'react-icons/fa';
import { z } from 'zod';

const NotificationsFormSchema = z.object({
  title: z.string().refine((d) => d.length > 0, {
    message: '제목을 입력해 주세요',
  }),
  image: z.instanceof(File).or(z.string()),
});

type NotificationsFormValues = z.infer<typeof NotificationsFormSchema>;

export default function NotificationsForm() {
  const [blobImage, setBlobImage] = useState<string | undefined>(undefined);
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(NotificationsFormSchema),
  });

  const createNotifications = useCreateNotificationsMutation({
    onSuccess: () => {
      //완료후 초기화
      notificationsForm.reset();
      setBlobImage(undefined);
    },
  });

  const handleInputFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    e.preventDefault();
    const file = e.target.files?.item(0);

    if (file) {
      fileToBlob({
        file,
        handler: ({ blob }: { blob: string }) => {
          setBlobImage(blob);
          field.onChange(file);
        },
      });
    }
  };

  const handleDeleteImage = () => {
    setBlobImage(undefined);
    notificationsForm.resetField('image');
  };

  const handleSubmit = (values: NotificationsFormValues) => {
    const formData = new FormData();

    // 제목 추가
    formData.append('title', values.title);
    if (values.image instanceof File) {
      formData.append('image', values.image); // File만 추가
    }

    // FormData를 전달
    createNotifications.mutate(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <Form {...notificationsForm}>
        <form
          onSubmit={notificationsForm.handleSubmit(handleSubmit)}
          className="space-y-8"
        >
          <div className="grid gap-6">
            <FormField
              control={notificationsForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    팝업 제목
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="제목을 입력해 주세요."
                      value={field.value ?? ''}
                      className="w-full transition-all focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              {blobImage ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">이미지</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => handleDeleteImage()}
                      className="flex items-center gap-2 hover:bg-destructive/90 hover:text-destructive-foreground transition-colors"
                    >
                      <FaMinus className="h-4 w-4" />
                      <span>삭제</span>
                    </Button>
                  </div>

                  {blobImage && (
                    <div className="relative w-full aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden bg-secondary/20">
                      <Image
                        src={blobImage}
                        fill
                        className="object-contain"
                        alt="등록 이미지"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <FormField
                  control={notificationsForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        이미지
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleInputFileChange(e, { ...field })
                            }
                            className="w-full h-full py-2 file:mr-4 file:py-2 file:px-4 
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-600 file:text-white
                            hover:file:bg-blue-700 cursor-pointer
                            text-sm text-muted-foreground
                            file:transition-colors file:duration-200"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={createNotifications.isPending}
              className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white 
                transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              {createNotifications.isPending ? '처리중...' : '등록하기'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
