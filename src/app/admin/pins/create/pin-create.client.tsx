'use client';

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
import productService from '@/services/product.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const PinFormSchema = z.object({
  productId: z.string().refine((d) => !!d, {
    message: '상품을 선택해 주세요.',
  }),
  number: z
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
  count: z.string().refine((d) => Number(d) > 0, {
    message: '0보다 큰 수를 입력해 주세요.',
  }),
});

type PinFormValues = z.infer<typeof PinFormSchema>;

export default function PinCreateClient() {
  //상품 목록 조회
  const { data: productList = [], isFetching } = useQuery({
    queryKey: ['getProudctList', 'pin-create'],
    queryFn: productService.getProudctList,
  });

  const pinForm = useForm<PinFormValues>({
    resolver: zodResolver(PinFormSchema),
    defaultValues: {
      productId: '', //첫번째?
      number: '',
      endDate: new Date(),
      count: '1',
    },
  });

  const handleSubmit = () => {
    console.log('전송', pinForm.getValues());
  };

  useEffect(() => {
    if (!isFetching) {
      pinForm.reset({
        productId: productList[0]?._id,
        number: '',
        endDate: new Date(),
        count: '1',
      });
    }
  }, [productList]);

  return (
    <Form {...pinForm}>
      <form onSubmit={pinForm.handleSubmit(handleSubmit)}>
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
                      {productList.map((d) => {
                        return (
                          <SelectItem key={d._id} value={d._id}>
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
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>핀 번호</FormLabel>
              <FormControl>
                <Input {...field} maxLength={4} />
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
          name="count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>생성 갯수</FormLabel>
              <FormControl>
                <Input {...field} />
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
