'use client';

import ProductDetailInfo from '../components/product-detail-info';
import SaleProductItem from '../components/sale-product-item.component';
import ProductDetailModal from './product-detail-modal';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
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
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';
import { PackageDetailName, SaleProductFormData } from '@/definitions';
import {
  useDetailSaleProductQuery,
  useSaleProductListQuery,
} from '@/queries/product.queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';

const SaleProductBuyFormSchema = z.object({
  buyDate: z.date(),
  buyHour: z.string().min(1, '시간을 선택해 주세요.'),
  buyMin: z.string().min(1, '분을 선택해 주세요.'),
  buyProducts: z.array(z.object({})).min(1, '상품을 선택해 주세요.'),
  buyName: z.string().min(1, '이름을 입력해 주세요.'),
  buyPhoneNumber: z.string().min(11, '휴대폰 번호를 모두 입력해 주세요.'),
  buyEmail: z.string(),
  buyNumber: z.string().min(6, '구매확인 번호를 입력해 주세요.'),
  consentCollection: z.boolean().refine((val) => val === true, {
    message: '개인정보 수집 동의는 필수입니다.',
  }),
  consentProvision: z.boolean().refine((val) => val === true, {
    message: '제 3자 제공 동의는 필수입니다.',
  }),
  consentCancellation: z.boolean().refine((val) => val === true, {
    message: '취소 및 환불 동의는 필수입니다.',
  }),
  buyType: z.string().min(1, '결제 방법을 선택해 주세요.'),
});

type SaleProductBuyFormValues = z.infer<typeof SaleProductBuyFormSchema>;

export default function ProductDetailClient({ id }: { id: string }) {
  const saleProductData = useSaleProductListQuery();
  const saleProductDetailData = useDetailSaleProductQuery(id);

  const currentHour = useMemo(() => String(new Date().getHours()), []);
  const currentMin = useMemo(
    () => String(Math.ceil(new Date().getMinutes() / 10) * 10),
    []
  );

  const saleProductForm = useForm<SaleProductBuyFormValues>({
    resolver: zodResolver(SaleProductBuyFormSchema),
    defaultValues: {
      buyDate: new Date(),
      buyHour: '',
      buyMin: '',
      buyProducts: [],
      buyName: '',
      buyPhoneNumber: '',
      buyEmail: '',
      buyNumber: '',
      consentCollection: false,
      consentProvision: false,
      consentCancellation: false,
      buyType: '',
    },
  });

  //체크박스들
  const handleChecked = () => {};

  //시간 분 선택
  const [selectHour, setSelectHour] = useState(currentHour);
  const [selectMin, setSelectMin] = useState('0');

  //상품 추가 선택 - 들어올때 해당 상품 되도록
  const [selectedSaleProduct, setSelectedSaleProduct] = useState<
    SaleProductFormData<PackageDetailName>[]
  >([]);

  //시간 선택
  const handleSelectHour = (hour: string, field: ControllerRenderProps) => {
    setSelectHour(hour);

    field.onChange(hour);
  };

  //분 선택
  const handleSelectMin = (min: string, field: ControllerRenderProps) => {
    setSelectMin(min);
    field.onChange(min);
  };

  //전체 동의
  const handleAllCheck = (e: ChangeEvent<HTMLInputElement>) => {};

  //추가 상품 선택
  const handleSelectedSaleProduct = (id: string) => {
    const selectItem = saleProductData.list.find((f) => f._id === id);

    setSelectedSaleProduct((prevData) => {
      const findData = prevData.find((f) => f._id === id);

      if (findData) {
        return prevData;
      } else {
        if (selectItem) {
          return [...prevData, selectItem];
        } else {
          return prevData;
        }
      }
    });
  };

  const handlePlus = (id: string = '') => {
    console.log('현재 상품 더하기');
  };

  const handleMinus = (id: string = '') => {
    console.log('현재 상품 빼기');
  };

  const handleDelete = (id: string = '') => {
    console.log('현재 상품 삭제');
  };

  //구매하기
  const handleSubmit = () => {
    console.log('aaaaaaaaaaa');
  };

  //최초 데이터 세팅
  useEffect(() => {
    if (saleProductData.list.length > 0) {
      const initData = saleProductData.list.filter((f) => f._id === id);
      setSelectedSaleProduct(initData);
    }
  }, [saleProductData, id]);

  useEffect(() => {
    saleProductForm.setValue('buyProducts', selectedSaleProduct);
  }, [saleProductForm, selectedSaleProduct]);

  if (Object.keys(saleProductDetailData).length < 1) {
    return false;
  }

  //회원가입하면 - 로그인한 사용자의 정보를 이용해 상품구매 세팅

  //판매 상품 아이디, 구매날짜, 구매시간, 추가된 상품,
  //구매자이름, 휴대폰 정보, 이메일, 구매확인비번
  //동의하는거

  return (
    <Form {...saleProductForm}>
      <form onSubmit={saleProductForm.handleSubmit(handleSubmit)}>
        <div className="flex flex-row space-y-8">
          {/* 상품 상세 정보 */}
          <ProductDetailInfo
            saleProductId={id}
            saleProductDetailData={saleProductDetailData}
          />

          {/* 상품 구매하기 */}
          <div className="basis-1/3 mx-3">
            <FormField
              control={saleProductForm.control}
              name="buyDate"
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

            <div className="grid grid-cols-2 gap-7">
              <FormField
                control={saleProductForm.control}
                name="buyHour"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>시간 선택</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          handleSelectHour(value, { ...field })
                        }
                        defaultValue={currentHour}
                        className="flex flex-col space-y-1"
                      >
                        {Array.from(
                          { length: 12 },
                          (_, idx: number) => 10 + idx
                        ).map((d) => {
                          const value = String(d);

                          return (
                            <FormItem
                              key={value}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={value}
                                  disabled={Number(value) < Number(currentHour)}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {value} 시
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saleProductForm.control}
                name="buyMin"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>분 선택</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          handleSelectMin(value, { ...field })
                        }
                        defaultValue={currentHour}
                        className="flex flex-col space-y-1"
                      >
                        {Array.from(
                          { length: 6 },
                          (_, idx: number) => 10 * idx
                        ).map((d) => {
                          const value = String(d).padEnd(2, '0');

                          return (
                            <FormItem
                              key={value}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {value} 분
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h1>상품 선택</h1>
              <Select onValueChange={handleSelectedSaleProduct}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상품 선택" />
                </SelectTrigger>
                <SelectContent>
                  {saleProductData.list.map((d) => {
                    return (
                      <SelectItem key={d._id} value={d._id ?? ''}>
                        {d.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h1>선택된 상품</h1>
              <div>
                {selectedSaleProduct.map((d) => {
                  return (
                    <SaleProductItem
                      key={d._id}
                      saleProduct={d}
                      onPlusClick={() => handlePlus(d._id)}
                      onMinusClick={() => handleMinus(d._id)}
                      onDeleteClick={() => handleDelete(d._id)}
                    />
                  );
                })}

                {saleProductForm.formState.errors.buyProducts && (
                  <span className="text-red-500 text-sm">
                    {saleProductForm.formState.errors.buyProducts.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 상품 구매 정보 */}
          <div className="basis-1/4 mx-3">
            <div className="space-y-8">
              <FormField
                control={saleProductForm.control}
                name="buyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>구매자명</FormLabel>
                    <FormControl>
                      <Input placeholder="구매자명" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saleProductForm.control}
                name="buyPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>휴대폰 번호</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={11} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                          <InputOTPSlot index={6} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={7} />
                          <InputOTPSlot index={8} />
                          <InputOTPSlot index={9} />
                          <InputOTPSlot index={10} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saleProductForm.control}
                name="buyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일(선택)</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saleProductForm.control}
                name="buyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>구매확인번호(구매 조회시 필요)</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <div>
                <Checkbox
                  id="allCheck"
                  // onChange={handleAllCheck}
                ></Checkbox>
                <Label
                  htmlFor="allCheck"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  전체동의
                </Label>
              </div>
              <FormField
                control={saleProductForm.control}
                name="consentCollection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>개인정보 수집 및 이용 동의</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={saleProductForm.control}
                name="consentProvision"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>개인정보 제3자 제공 동의</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <li>
                  <Checkbox id="consentAged14andAbove"></Checkbox>
                  <Label
                    htmlFor="consentAged14andAbove"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    만 14세 이상에 동의
                  </Label>
                </li> */}
              {/* <li>
                  <Checkbox id="consentPromotional"></Checkbox>
                  <Label
                    htmlFor="consentPromotional"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    광고성 정보수신 동의
                  </Label>
                </li> */}
              <FormField
                control={saleProductForm.control}
                name="consentCancellation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>취소/환불규정 동의</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label>결제시 유의사항</Label>
              </div>
              <div>결제 예정 금액</div>

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
                          defaultValue={currentHour}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex gap-10">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="creditCard" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                신용카드
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="accountTransfer" />
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
        </div>

        <div className="flex justify-center pt-4">
          <Button>구매하기</Button>
        </div>
      </form>
    </Form>
  );
}
