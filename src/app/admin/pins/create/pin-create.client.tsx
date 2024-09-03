'use client';

import { useCreatePinMutation, useProductListQuery } from '../../queries';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChangeEvent, useEffect } from 'react';
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

  const pinForm = useForm<PinFormValues>({
    resolver: zodResolver(PinFormSchema),
    defaultValues: {
      pinPrefixFour: '',
      endDate: new Date(),
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
    <Form {...pinForm}>
      <form onSubmit={pinForm.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={pinForm.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상품</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {productData.list.map((d) => {
                        return (
                          <SelectItem key={d._id} value={String(d._id)}>
                            {d.name}
                          </SelectItem>
                        );
                      })}
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
            <FormItem>
              <FormLabel>핀 번호</FormLabel>
              <FormControl>
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={pinForm.control}
          name="endDate"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>종료일</FormLabel>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ko })
                          ) : (
                            <span>날짜를 선택하세요.</span>
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
                          format(new Date(), 'yyyyMMdd')
                        }
                        initialFocus
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormItem>
            );
          }}
        />

        <FormField
          control={pinForm.control}
          name="pinCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>생성 갯수</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.onChange(Number(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center pt-4">
          <Button type="submit">핀번호 생성</Button>
        </div>
      </form>
    </Form>
  );
}
