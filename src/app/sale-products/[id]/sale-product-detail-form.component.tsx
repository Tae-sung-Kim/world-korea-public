'use client';

import TransPaymentModal from './trans-payment.modal';
import { useOrderSaleProductMutation } from '@/app/admin/queries';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useModalContext } from '@/contexts/modal.context';
import {
  ProductDisplayData,
  SaleProductFormData,
  TransResponse,
  OrderPayType,
  RequestPayParams,
} from '@/definitions';
import usePortonePayment from '@/hooks/usePortonePayment';
import { addComma } from '@/utils/number';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-separator';
import { format, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const SaleProductBuyFormSchema = z.object({
  visitDate: z.date(),
  orderDate: z.date(),
  saleProduct: z.string(),
  amount: z.number().min(1, '금액을 입력해 주세요.'),
  quantity: z
    .number()
    .min(1, '수량을 선택해 주세요.')
    .max(99, '최대 수량은 99개입니다.'),
  payType: z.nativeEnum(OrderPayType),
  taxFree: z.number(),
});

type SaleProductBuyFormValues = z.infer<typeof SaleProductBuyFormSchema>;

type SaleProductDetailFormProps = {
  saleProductId: string;
  saleProductDetailData: Partial<SaleProductFormData<ProductDisplayData>>;
};

export default function SaleProductDetailForm({
  saleProductId,
  saleProductDetailData,
}: SaleProductDetailFormProps) {
  const { openModal } = useModalContext();

  const { onPayment } = usePortonePayment({
    // 계좌 입금
    onTransPayment: async (res: TransResponse) => {
      return await openModal({
        title: '계좌입금 안내',
        Component: () => {
          return <TransPaymentModal trans={res} />;
        },
        onOk: () => {
          window.location.reload();
        },
        useCancelButton: false,
      });
    },
    // 카드 결제
    onPaymentSuccess: () => {
      window.location.reload();
    },
  });
  const purchaseDate = useMemo(() => addDays(new Date(), 1), []);

  const createOrderSaleProduct = useOrderSaleProductMutation({
    onSuccess: async (data) => {
      if (data) {
        const orderId = data._id;
        const reqData: RequestPayParams = {
          pay_method: saleProductForm.getValues().payType, // 결제수단
          merchant_uid: `mid_${purchaseDate.getTime()}`, // 주문번호
          amount: saleProductForm.getValues().amount,
          name: saleProductDetailData.name, // 주문명
          tax_free: saleProductForm.getValues().taxFree,
        };
        await onPayment(reqData, orderId);
      } else {
        toast.error('다시 시도하여 주세요.');
        return null;
      }
    },
  });

  const saleProductForm = useForm<SaleProductBuyFormValues>({
    resolver: zodResolver(SaleProductBuyFormSchema),
    defaultValues: {
      visitDate: purchaseDate,
      quantity: 0,
      payType: OrderPayType.Card,
      orderDate: new Date(),
      taxFree: 0,
    },
  });

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

      //면세
      saleProductForm.setValue(
        'taxFree',
        Number(saleProductDetailData.taxFree) * numberValue
      );
    }
  };

  // 최초 상품 아이디 지정
  useEffect(() => {
    saleProductForm.setValue('saleProduct', saleProductId);
  }, [saleProductForm, saleProductId]);

  return (
    <Form {...saleProductForm}>
      <form
        onSubmit={saleProductForm.handleSubmit(handleSubmit)}
        className="w-full lg:w-1/2"
      >
        <div className="backdrop-blur-md bg-white/60 rounded-xl p-6 lg:p-8 shadow-lg">
          <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6">
            {saleProductDetailData.name}
          </h1>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-lg text-muted-foreground">가격</span>
              <span className="text-2xl font-semibold">
                {`₩ ${addComma(saleProductDetailData.price ?? 0)}`}
              </span>
            </div>

            <Separator className="my-4" />

            <FormField
              control={saleProductForm.control}
              name="visitDate"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-medium">
                    날짜 선택
                  </FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      format(date, 'yyyyMMdd') <
                      format(purchaseDate, 'yyyyMMdd')
                    }
                    locale={ko}
                    className="rounded-lg border shadow-md p-4 bg-white"
                    classNames={{
                      months:
                        'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
                      month: 'space-y-4 w-full flex flex-col',
                      caption:
                        'flex justify-center pt-1 relative items-center text-lg font-medium',
                      nav_button: 'absolute hover:opacity-75',
                      nav_button_previous: 'left-1',
                      nav_button_next: 'right-1',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex justify-between',
                      head_cell:
                        'text-muted-foreground font-medium text-sm w-10 text-center',
                      row: 'flex w-full justify-between mt-2',
                      cell: 'text-center relative w-10 h-10',
                      day: 'h-10 w-10 p-0 font-normal hover:bg-accent hover:text-accent-foreground rounded-full transition-colors focus:bg-primary focus:text-primary-foreground',
                      day_selected:
                        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                      day_today: 'bg-accent/50 text-accent-foreground',
                      day_outside: 'text-muted-foreground opacity-50',
                      day_disabled: 'text-muted-foreground opacity-50',
                      day_range_middle: 'rounded-none',
                      day_hidden: 'invisible',
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
                        className="bg-white/90"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <span className="hidden">
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
                          className="bg-muted/90 font-semibold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </span>
            </div>

            <FormField
              control={saleProductForm.control}
              name="payType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>결제 수단</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={OrderPayType.Card} />
                        </FormControl>
                        <FormLabel className="font-normal">신용카드</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={OrderPayType.Trans} />
                        </FormControl>
                        <FormLabel className="font-normal">계좌입금</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={saleProductForm.formState.isSubmitting}
            >
              {saleProductForm.watch('payType') === OrderPayType.Trans
                ? '계좌입금'
                : '결제하기'}
              ({addComma(saleProductForm.watch('amount'))}원)
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
