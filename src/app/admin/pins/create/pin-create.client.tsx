'use client';

import { useCreatePinMutation, useProductListQuery } from '../../queries';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const PinFormSchema = z.object({
  productId: z.string().refine((d) => !!d, {
    message: '상품을 선택해 주세요.',
  }),
  pinPrefixFour: z
    .string()
    .refine((d) => !!d, {
      message: '핀번호를 입력해 주세요.',
    })
    .refine((d) => !isNaN(Number(d)), {
      message: '숫자만 입력해 주세요.',
    })
    .refine((d) => String(d).length > 3, {
      message: '4자리를 입력해 주세요.',
    }),
  endDate: z.date(),
  pinCount: z.number().refine((d) => Number(d) > 0, {
    message: '0보다 큰 수를 입력해 주세요.',
  }),
});

type PinFormValues = z.infer<typeof PinFormSchema>;

export default function PinCreateClient() {
  const productData = useProductListQuery({});

  const pinEndDate = useMemo(() => addDays(new Date(), 1), []);

  const pinForm = useForm<PinFormValues>({
    resolver: zodResolver(PinFormSchema),
    defaultValues: {
      pinPrefixFour: '',
      endDate: pinEndDate,
      pinCount: 1,
    },
  });

  const handleResetFormData = () => {
    pinForm.reset();
  };

  const createPinMutation = useCreatePinMutation({
    onSuccess: handleResetFormData,
  });

  const handleSubmit = () => {
    createPinMutation.mutate(pinForm.getValues());
  };

  useEffect(() => {
    if (Array.isArray(productData.list) && productData.list.length > 0) {
      pinForm.reset({
        productId: productData.list[0]?._id,
      });
    }
  }, [productData, pinForm]);

  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">핀 번호 생성</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          새로운 핀 번호를 생성하기 위한 정보를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...pinForm}>
          <form
            onSubmit={pinForm.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={pinForm.control}
                name="productId"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel className="font-semibold">상품</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="상품을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {productData.list.map((d) => (
                              <SelectItem key={d._id} value={String(d._id)}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={pinForm.control}
                name="pinPrefixFour"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel className="font-semibold">핀 번호</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={4}
                          {...field}
                          onChange={(value: string) => {
                            field.onChange(value);
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={pinForm.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel className="font-semibold">종료일</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ko })
                            ) : (
                              <span>날짜를 선택하세요</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            format(date, 'yyyMMdd') <
                            format(pinEndDate, 'yyyyMMdd')
                          }
                          initialFocus
                          locale={ko}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={pinForm.control}
                name="pinCount"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel className="font-semibold">생성 갯수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          field.onChange(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="form-button-area space-x-4">
              <Button
                type="button"
                variant="reset"
                onClick={handleResetFormData}
              >
                초기화
              </Button>
              <Button type="submit" variant="submit">
                핀번호 생성
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
