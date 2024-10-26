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

  const handleSubmit = () => {
    const { title, image } = notificationsForm.getValues();
    const formData = new FormData();

    // 제목 추가
    formData.append('title', title);
    if (image instanceof File) {
      formData.append('image', image); // File만 추가
    }

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
              {blobImage ? (
                <div>
                  <Label>이미지</Label>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => handleDeleteImage()}
                  >
                    <FaMinus />
                  </Button>

                  {blobImage && (
                    <Image
                      src={blobImage}
                      width={250}
                      height={250}
                      alt="등록 이미지"
                    />
                  )}
                </div>
              ) : (
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
