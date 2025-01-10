'use client';

import QrCodeScanButton from '@/app/admin/components/qr-code-scan-button.component';
import { useUsedPinListMutation } from '@/app/admin/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { PinUsed } from '@/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const PinFormSchema = z.object({
  pinNumberList: z
    .string()
    .refine((d) => d.length > 0, { message: '핀 번호를 입력해주세요' }),
});

type PinFormValues = z.infer<typeof PinFormSchema>;

export default function PinUsed() {
  const handleResetFormData = () => {
    pinForm.reset();
  };

  const usedPinListMutation = useUsedPinListMutation({
    onSuccess: handleResetFormData,
  });

  const pinForm = useForm<PinFormValues>({
    resolver: zodResolver(PinFormSchema),
    defaultValues: {
      pinNumberList: '',
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
      pinNumberList: [],
    };

    for (const [key, value] of Object.entries(formValues)) {
      if (key === 'pinNumberList') {
        data[key] = excelDataToPinUsedData(value);
      } else {
        console.error('키가 존재 하지 않습니다.');
      }
    }

    usedPinListMutation.mutate(data);
  };

  //formData에 추가
  const handleSetData = (qrData: string) => {
    const prevData = pinForm.getValues('pinNumberList').split('\n');
    let sumData: string[] = [];

    //이전 데이터가 있다면, \n 추가
    if (prevData.length > 0) {
      sumData = prevData;
    }
    sumData.push(qrData);

    const pinNumbers = sumData.reduce((acc: string[], cur: string) => {
      if (!acc.includes(cur) && !!cur) {
        acc.push(cur);
      }
      return acc;
    }, []);

    pinForm.setValue('pinNumberList', pinNumbers.join('\n'));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="space-y-6 pt-8">
        <div className="form-button-area">
          <QrCodeScanButton onResiveData={handleSetData} />
        </div>
        <Form {...pinForm}>
          <form
            onSubmit={pinForm.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={pinForm.control}
              name="pinNumberList"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      핀번호 입력
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[200px] lg:min-h-[400px] font-mono"
                        placeholder="엑셀에서 복사한 핀 번호를 붙여넣기 해주세요."
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                );
              }}
            />

            <div className="flex justify-center">
              <Button size="lg" type="submit" variant="submit">
                핀번호 사용하기
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
