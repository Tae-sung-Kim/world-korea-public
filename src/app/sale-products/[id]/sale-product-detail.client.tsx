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
import { toast, Toaster } from 'sonner';
import { z } from 'zod';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props = {
  saleProductId: string;
};

const SaleProductBuyFormSchema = z.object({
  orderDate: z.date(),
  saleProduct: z.string(),
  amount: z.number().min(1, '금액을 입력해 주세요.'),
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
    const value = e.target.value.replace(/^0+/, ''); // 앞의 0 제거
    const numberValue = value === '' ? 0 : parseInt(value, 10);

    // 0보다 크거나 같을 때만
    if (numberValue >= 0) {
      field.onChange(numberValue);

      saleProductForm.setValue(
        'amount',
        Number(saleProductDetailData.price) * numberValue
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
      <form onSubmit={saleProductForm.handleSubmit(handleSubmit)} className="container mx-auto px-4 py-8">
        <Toaster position="bottom-center" expand={true} richColors />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 이미지 섹션 */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col space-y-6">
              <div className="flex justify-center items-center">
                <Carousel className="w-full max-w-md">
                  <CarouselContent>
                    {images.map((d) => (
                      <CarouselItem key={String(d)}>
                        <div className="aspect-square w-full p-2">
                          <Image
                            className="w-full h-full object-contain rounded-3xl"
                            alt="상품 이미지"
                            width={500}
                            height={500}
                            src={String(d) ?? ''}
                            priority
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </div>

              {/* 썸네일 갤러리 */}
              <div className="space-y-4">
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                  <div className="flex w-max space-x-2 p-1">
                    {images.map((d, index) => (
                      <div
                        key={String(d)}
                        className="w-[100px] shrink-0 aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 hover:border-primary"
                      >
                        <Image
                          className="w-full h-full object-cover"
                          alt={`상품 이미지 ${index + 1}`}
                          width={100}
                          height={100}
                          src={String(d) ?? ''}
                        />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="bg-secondary" />
                </ScrollArea>
              </div>

            </div>
          </div>

          {/* 상품 정보 섹션 */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6">
                {saleProductDetailData.name}
              </h1>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">가격</span>
                  <span className="text-2xl font-semibold">{`₩ ${addComma(
                    saleProductDetailData.price ?? 0
                  )}`}</span>
                </div>

                <Separator className="my-4" />

                <FormField
                  control={saleProductForm.control}
                  name="orderDate"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-lg">날짜 선택</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          format(date, 'yyyMMdd') < format(new Date(), 'yyyyMMdd')
                        }
                        className="rounded-md border shadow-sm"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            min="0"
                            value={field.value || ''}
                            placeholder="수량을 입력하세요"
                            onChange={(e) => handleCountChange(e, { ...field })}
                            className="text-lg"
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
                        <FormLabel>총 금액</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={addComma(field.value)}
                            type="text"
                            readOnly
                            disabled
                            className="text-lg font-semibold bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={saleProductForm.control}
                  name="buyType"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-lg">결제 방법</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={'card'}
                          className="flex gap-6"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="card" />
                            </FormControl>
                            <FormLabel className="font-normal text-base">
                              신용카드
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="trans" />
                            </FormControl>
                            <FormLabel className="font-normal text-base">
                              계좌이체
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full text-lg py-6">
                  구매하기
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 이용 안내 섹션 */}
        <div className="bg-white rounded-lg p-6 shadow-sm mt-8">
          <div className="flex items-center gap-2 text-xl font-semibold mb-6">
            <FcInfo size={24} />
            <span>이용 안내</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">운영 시간</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>
                  운영시간 및 입장가능시간은 변동될 수 있으니 꼭 당일
                  현장으로 확인바랍니다.
                </li>
                {Array.isArray(productList) &&
                  productList.map((d) => (
                    <li key={d._id}>{d.description1}</li>
                  ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">주의사항</h3>
              <ul className="list-disc pl-5 space-y-2 text-rose-600">
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

        {/* 상품 상세 정보 섹션 */}
        {Array.isArray(productList) && (
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {productList.map((d) => {
                const { images, name, description2, description3 } = d;
                return (
                  <div 
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all" 
                    key={d._id}
                  >
                    {/* 상품 이미지 */}
                    <div className="relative aspect-video w-full overflow-hidden">
                      {images[0] && (
                        <Image
                          className="w-full h-full object-cover"
                          alt="상품 대표 이미지"
                          width={600}
                          height={400}
                          src={String(images[0])}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <h2 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                        {name}
                      </h2>
                    </div>

                    {/* 상품 설명 */}
                    <div className="p-6 space-y-6">
                      {/* 추가 이미지 그리드 */}
                      {images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {images.slice(1).map((img) => (
                            <div 
                              key={String(img)} 
                              className="aspect-square rounded-md overflow-hidden"
                            >
                              <Image
                                className="w-full h-full object-cover hover:scale-110 transition-transform"
                                alt="상품 추가 이미지"
                                width={150}
                                height={150}
                                src={String(img)}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 상품 상세 설명 */}
                      <div className="space-y-4">
                        <div className="prose max-w-none">
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium border-l-4 border-primary pl-3">
                              상품 설명
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {description2}
                            </p>
                          </div>
                          {description3 && (
                            <div className="space-y-2 mt-4">
                              <h3 className="text-lg font-medium border-l-4 border-primary pl-3">
                                추가 정보
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                {description3}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
