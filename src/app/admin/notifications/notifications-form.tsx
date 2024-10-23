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
import { z } from 'zod';

const NotificationsFormSchema = z.object({
  title: z.string().refine((d) => d.length > 0, {
    message: '제목을 입력해 주세요',
  }),
  image: z.array(z.union([z.instanceof(File), z.string()])),
});

type NotificationsFormValues = z.infer<typeof NotificationsFormSchema>;

export default function NotificationsForm() {
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(NotificationsFormSchema),
  });

  const createNotifications = useCreateNotificationsMutation();

  const [blobImage, setBlobImage] = useState<string>('');

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
          field.onChange([file]);
        },
      });
    }
  };

  const handleSubmit = () => {
    const currentValues = notificationsForm.getValues();
    const formData = new FormData();
    // 제목 추가
    formData.append('title', currentValues.title);

    // 이미지가 배열이므로 각각 추가
    currentValues.image.forEach((img) => {
      if (img instanceof File) {
        formData.append('image', img); // File만 추가
      }
    });

    // FormData를 전달
    createNotifications.mutate(formData);
  };

  return (
    <div className="container">
      <h1>팝업 등록</h1>

      <div className="space-y-8">
        <Form {...notificationsForm}>
          <form
            onSubmit={notificationsForm.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={notificationsForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>팝업 제목</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="제목을 입력해 주세요."
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormField
                control={notificationsForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이미지</FormLabel>
                    <FormControl>
                      <Input
                        className="flex-initial"
                        type="file"
                        accept="image/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputFileChange(e, { ...field })
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Label>이미지 미보기</Label>
              {blobImage && (
                <Image
                  src={blobImage}
                  width={250}
                  height={250}
                  alt="등록 이미지"
                />
              )}
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit">등록</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
