'use client';

import { useUsedPinListMutation } from '../../queries';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { PinUsed } from '@/definitions/pins.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const PinFormSchema = z.object({
  pinList: z
    .string()
    .refine((d) => d.length > 0, { message: '핀 번호를 입력해주세요' }),
});

type PinFormValues = z.infer<typeof PinFormSchema>;

export default function PinUsedClient() {
  const handleResetFormData = () => {
    pinForm.reset();
  };

  const usedPinListMutation = useUsedPinListMutation({
    onSuccess: handleResetFormData,
  });

  const pinForm = useForm<PinFormValues>({
    resolver: zodResolver(PinFormSchema),
    defaultValues: {
      pinList: '',
    },
  });

  const excelDataToPinUsedData = (value: string): string[] => {
    const splitLineValue = value.split('\n');

    return splitLineValue.reduce((acc: string[], cur: string) => {
      const splitTabValue = cur.split('\t');

      acc.push(splitTabValue[0].replaceAll('-', ''));

      return acc;
    }, []);
  };

  const handleSubmit = () => {
    const formValues = pinForm.getValues();
    const data: PinUsed = {
      pinList: [],
    };

    for (const [key, value] of Object.entries(formValues)) {
      if (key === 'pinList') {
        data[key] = excelDataToPinUsedData(value);
      } else {
        console.error('키가 존재 하지 않습니다.');
      }
    }

    usedPinListMutation.mutate(data);
  };

  return (
    <Form {...pinForm}>
      <form onSubmit={pinForm.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={pinForm.control}
          name="pinList"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>핀번호 등록</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="h-[400px]"
                    placeholder={`엑셀에서 복사한 핀 번호를 붙여넣기 해주세요.`}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex justify-center pt-4">
          <Button>핀번호 사용</Button>
        </div>
      </form>
    </Form>
  );
}
