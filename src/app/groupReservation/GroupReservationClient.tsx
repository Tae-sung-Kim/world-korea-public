'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const phoneRegex = new RegExp(/^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/);

const FormSchema = z.object({
  personType: z.string({
    required_error: '나이를 선택해 주세요.',
  }),
  peopleCount: z
    .string({
      required_error: '인원수를 입력해 주세요.',
    })
    .refine((val) => Number(val) > 0, {
      message: '1명이상 예약 가능합니다.',
    })
    .refine((val) => Number(val) <= 99, {
      message: '99명까지 예약 가능합니다.',
    }),
  reserveDate: z.date({
    required_error: '날짜를 선택해 주세요.',
  }),
  // product: z.array(
  //   z.object({
  //     productCode: z.string(),
  //     productName: z.string(),
  //   })
  // ),
  reserverName: z.string().refine((val) => !(!val || val === ''), {
    message: '이름을 입력해 주세요.',
  }),
  reserverTel: z.string().regex(phoneRegex, '전화번호를 확인해주세요'),
});

export default function GroupReservationClient() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // personType: '',
      peopleCount: '0',
      // reserveDate: new Date(),
      reserverName: '',
      reserverTel: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="personType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>예약 인원 구분</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="36under" />
                    </FormControl>
                    <FormLabel className="font-normal">36개월 미만</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="37above" />
                    </FormControl>
                    <FormLabel className="font-normal">37개월 이상</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="peopleCount"
          render={({ field }) => {
            return (
              <FormItem className="space-y-3">
                <FormLabel>인원 수</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="peopleCount"
          render={({ field }) => {
            return (
              <FormItem className="space-y-3">
                <FormLabel>상품</FormLabel>
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="reserveDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>예약일 선택</FormLabel>
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
                      format(date, 'yyyMMdd') < format(new Date(), 'yyyyMMdd')
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
          control={form.control}
          name="reserverName"
          render={({ field }) => {
            return (
              <FormItem className="space-y-3">
                <FormLabel>예약자</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="reserverTel"
          render={({ field }) => {
            return (
              <FormItem className="space-y-3">
                <FormLabel>전화번호</FormLabel>
                <FormControl>
                  <Input placeholder="- 제외(01011112222)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit">예약</Button>
      </form>
    </Form>
  );
}
