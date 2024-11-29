'use client';

import { useOrderSaleProductMutation } from '@/app/admin/queries';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RequestPayParams } from '@/definitions/portone.type';
import usePortonePayment from '@/hooks/usePortonePaymnent';
import { useDetailSaleProductQuery } from '@/queries/product.queries';
import { addComma } from '@/utils/number';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-separator';
import { format } from 'date-fns';
import Image from 'next/image';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { FcInfo } from 'react-icons/fc';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
  saleProductId: string;
};

const SaleProductBuyFormSchema = z.object({
  orderDate: z.date(),
  saleProduct: z.string(),
  amount: z.number(),
  quantity: z
    .number()
    .min(1, '수량을 선택해 주세요.')
    .max(99, '최대 수량은 99개입니다.'),
  buyType: z.enum(['card', 'trans']),
});

type SaleProductBuyFormValues = z.infer<typeof SaleProductBuyFormSchema>;

export default function SaleProductDetailClient({ saleProductId }: Props) {
  const { onPayment } = usePortonePayment();

  const createOrderSaleProduct = useOrderSaleProductMutation({
    onSuccess: (data) => {
      if (data) {
        const orderId = data._id;
        const reqData: RequestPayParams = {
          pay_method: saleProductForm.getValues().buyType, // 결제수단
          merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
          amount: saleProductForm.getValues().amount,
          name: saleProductDetailData.name, // 주문명
        };
        onPayment(reqData, orderId);
      } else {
        toast.error('다시 시도하여 주세요.');
        return null;
      }
    },
  });

  const saleProductForm = useForm<SaleProductBuyFormValues>({
    resolver: zodResolver(SaleProductBuyFormSchema),
    defaultValues: {
      orderDate: new Date(),
      quantity: 0,
      buyType: 'card',
    },
  });

  const saleProductDetailData = useDetailSaleProductQuery(saleProductId);

  const productList = useMemo(
    () => saleProductDetailData.products ?? [],
    [saleProductDetailData.products]
  );

  // 모든 상품 이지미
  const images = useMemo(
    () => productList.map((d) => d.images).flat() ?? [],
    [productList]
  );

  // 구매하기
  const handleSubmit = () => {
    createOrderSaleProduct.mutate(saleProductForm.getValues());
  };

  // 수량 선택
  const handleCountChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    const value = e.target.value;

    // 0보다 클때만
    if (Number(value) > -1) {
      field.onChange(Number(e.target.value));

      saleProductForm.setValue(
        'amount',
        Number(saleProductDetailData.price) * Number(e.target.value)
      );
    }
  };

  // 최초 상품 아이디 지정
  useEffect(() => {
    saleProductForm.setValue('saleProduct', saleProductId);
  }, [saleProductForm, saleProductId]);

  if (Object.keys(saleProductDetailData).length < 1) {
    return false;
  }

  return (
    <Form {...saleProductForm}>
      <form onSubmit={saleProductForm.handleSubmit(handleSubmit)}>
        <div className="flex flex-row space-y-8">
          <div className="basis-1/2 mx-3">
            <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {images.map((d) => {
                    return (
                      <CarouselItem key={String(d)}>
                        <div className="p-2">
                          <Image
                            className="w-full h-full rounded-full"
                            alt="상품 이미지"
                            width={150}
                            height={150}
                            src={String(d) ?? ''}
                          />
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
          <div className="basis-1/2 mx-3 space-y-8">
            <h1 className="font-bold text-2xl text-center">
              {saleProductDetailData.name}
            </h1>
            <Separator className="my-2 bg-rose-100 h-0.5" />

            <div>
              <span className="text-xl m-4">{`₩ ${addComma(
                saleProductDetailData.price ?? 0
              )}`}</span>

              <Separator className="my-2 bg-indigo-100 h-0.5" />
            </div>

            <div>
              <FormField
                control={saleProductForm.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>날짜 선택</FormLabel>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        format(date, 'yyyMMdd') < format(new Date(), 'yyyyMMdd')
                      }
                      className="rounded-md border"
                      classNames={{
                        months:
                          'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
                        month: 'space-y-4 w-full flex flex-col',
                        table: 'w-full h-full border-collapse space-y-1',
                        head_row: '',
                        row: 'w-full mt-2',
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-2 bg-indigo-100 h-0.5" />

            <div>
              <FormField
                control={saleProductForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>수량</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="수량"
                        onChange={(e) => handleCountChange(e, { ...field })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={saleProductForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>구매 가격</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={addComma(field.value)}
                        type="text"
                        readOnly
                        disabled
                        placeholder="구매 가격"
                        // onChange={(e) => handleCountChange(e, { ...field })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-2 bg-indigo-100 h-0.5" />

            <div className="space-y-5">
              <span className="flex items-center gap-1 text-xl font-bold">
                <FcInfo />
                Info
              </span>
              <div className="flex">
                <div className="basis-1/5 mx-3">Hours</div>
                <div className="basis-4/5 mx-3">
                  <ul className="list-disc">
                    <li>
                      운영시간 및 입장가능시간은 변동될 수 있으니 꼭 당일
                      현장으로 확인바랍니다.
                    </li>
                    {Array.isArray(productList) &&
                      productList.map((d) => {
                        const { description1 } = d;

                        return <li key={d._id}>{description1}</li>;
                      })}
                  </ul>
                </div>
              </div>
              <div className="flex">
                <div className="basis-1/5 mx-3">Information</div>
                <div className="basis-4/5 mx-3">
                  <ul className="list-disc text-rose-600">
                    <li>
                      구매하신 티켓은 환불 및 취소가 불가합니다. 신중하게 구매해
                      주세요.
                    </li>
                    <li>
                      You cannot refund or cancel the ticket you purchased.
                    </li>
                    <li>Please make a careful purchase</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="my-2 bg-indigo-100 h-0.5" />
            <div>
              <FormField
                control={saleProductForm.control}
                name="buyType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>결제 방법</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={'card'}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex gap-10">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="card" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              신용카드
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="trans" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              계좌이체
                            </FormLabel>
                          </FormItem>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center p-4">
          <Button>구매하기</Button>
        </div>

        <Separator className="my-2 bg-indigo-100 h-0.5 mt-10" />

        {Array.isArray(productList) && (
          <div className="space-y-4">
            {productList.map((d) => {
              const { images, name, description2, description3 } = d;

              return (
                <div className="" key={d._id}>
                  <h1 className="text-xl mb-10">{name}</h1>
                  <div className="grid grid-cols-3">
                    {images.map((d) => {
                      return (
                        <div className="w-96" key={String(d)}>
                          <Image
                            className="w-full h-full "
                            alt="상품 이미지"
                            width={150}
                            height={150}
                            src={String(d) ?? ''}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    Detail
                    <p>{description2}</p>
                  </div>
                  <div>
                    <p>{description3}</p>
                  </div>
                  <Separator className="my-2 bg-indigo-100 h-0.5" />
                </div>
              );
            })}
          </div>
        )}
      </form>
    </Form>
  );
}
