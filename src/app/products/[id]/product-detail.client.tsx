'use client';

import ProductDetailInfo from './product-detail-info';
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
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { z } from 'zod';

const SaleProductBuyFormSchema = z.object({
  buyDate: z.date(),
  buyHour: z.string(),
  buyMin: z.string(),
  buyProducts: z.array(z.object({})).min(1, '상품을 선택해 주세요.'),
  buyName: z.string().min(1, '이름을 입력해 주세요.'),
  buyPhoneNumber: z.string().min(11, '휴대폰 번호를 모두 입력해 주세요.'),
  buyEmail: z.string(),
  buyNumber: z.string().min(6, '구매확인 번호를 입력해 주세요.'),
  consentCollection: z.boolean(), //개인정보 수집 동의
  consentProvision: z.boolean(), //제 3자 제공동의
  consentCancellation: z.boolean(), //취소 환불
  buyType: z.string(),
});

type SaleProductBuyFormValues = z.infer<typeof SaleProductBuyFormSchema>;

export default function ProductDetailClient({ id }: { id: string }) {
  const saleProductData = useSaleProductListQuery();
  const saleProductDetailData = useDetailSaleProductQuery(id);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const currentHour = useMemo(() => String(new Date().getHours()), []);
  const currentMin = useMemo(
    () => String(Math.ceil(new Date().getMinutes() / 10) * 10),
    []
  );

  const saleProductForm = useForm<SaleProductBuyFormValues>({
    resolver: zodResolver(SaleProductBuyFormSchema),
    defaultValues: {
      buyDate: new Date(),
      buyHour: new Date().getHours().toString(),
      buyMin: new Date().getMinutes().toString(),
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
  const handleSelectHour = (hour: string) => {
    setSelectHour(hour);
  };

  //분 선택
  const handleSelectMin = (min: string) => {
    setSelectMin(min);
  };

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

  const handlePlus = () => {
    console.log('현재 상품 더하기');
  };

  const handleMinus = () => {
    console.log('현재 상품 빼기');
  };

  const handleDelete = () => {
    console.log('현재 상품 삭제');
  };

  //구매하기
  const handleSubmit = () => {};

  useEffect(() => {
    if (saleProductData.list.length > 0) {
      setSelectedSaleProduct(saleProductData.list.filter((f) => f._id === id));
    }
  }, [saleProductData, id]);

  if (Object.keys(saleProductDetailData).length < 1) {
    return false;
  }

  //회원가입하면 - 로그인한 사용자의 정보를 이용해 상품구매 세팅

  //판매 상품 아이디, 구매날짜, 구매시간, 추가된 상품,
  //구매자이름, 휴대폰 정보, 이메일, 구매확인비번
  //동의하는거

  return (
    <Form {...saleProductForm}>
      <form>
        <div className="flex flex-row space-y-8">
          {/* 상품 상세 정보 */}
          <ProductDetailInfo
            saleProductId={id}
            saleProductDetailData={saleProductDetailData}
          />

          {/* 상품 구매하기 */}
          <div className="basis-1/3 mx-3">
            <h1 className="">날짜 선택</h1>
            <div className="w-full">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
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
            </div>
            <div>
              <h1>시간 선택</h1>
              <RadioGroup
                defaultValue={currentHour}
                onValueChange={handleSelectHour}
              >
                {date && (
                  <div className="grid grid-cols-6 gap-2 m-4">
                    {Array.from(
                      { length: 12 },
                      (_, idx: number) => 10 + idx
                    ).map((d) => {
                      const value = String(d);

                      return (
                        <div
                          key={value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={value}
                            id={value + 'hour'}
                            disabled={Number(value) < Number(currentHour)}
                          />
                          <Label htmlFor={value + 'hour'}>{value} 시</Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </RadioGroup>
            </div>
            <div>
              <h1>분 선택</h1>
              <RadioGroup
                defaultValue={currentMin}
                onValueChange={handleSelectMin}
              >
                {date && (
                  <div className="grid grid-cols-6 gap-2 m-4">
                    {Array.from(
                      { length: 6 },
                      (_, idx: number) => 10 * idx
                    ).map((d) => {
                      const value = String(d).padEnd(2, '0');

                      return (
                        <div
                          key={value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={value}
                            id={value + 'min'}
                            // disabled={}
                          />
                          <Label htmlFor={value + 'min'}>{value} 분</Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </RadioGroup>
            </div>
            <div className="flex gap-5">
              <div>
                <h1>상품 선택</h1>

                <Select onValueChange={handleSelectedSaleProduct}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="상품 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {saleProductData.list.map((d) => {
                        return (
                          <SelectItem key={d._id} value={d._id ?? ''}>
                            {d.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h1>선택된 상품</h1>
                {selectedSaleProduct.map((d) => {
                  return (
                    <div key={d._id}>
                      <Label>{d.name}</Label>
                      <Input type="number" className="w-16" />
                      <Button
                        size="icon"
                        variant="outline"
                        type="button"
                        onClick={handlePlus}
                      >
                        <FaPlus />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        type="button"
                        onClick={handleMinus}
                      >
                        <FaMinus />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 상품 구매 정보 */}
          <div className="basis-1/4 mx-3">
            <div className="space-y-8">
              <h1>구매자 정보</h1>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="reserveName">구매자명</Label>
                <Input id="reserveName" placeholder="구매자 명" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="reserveName">휴대폰 번호</Label>
                <InputOTP maxLength={11}>
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
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Email" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">구매확인번호(구매 조회시 필요)</Label>
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <div>
              <ul>
                <li>
                  <Checkbox id="allCheck"></Checkbox>
                  <Label
                    htmlFor="allCheck"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    전체동의
                  </Label>
                </li>
                <li>
                  <Checkbox id="consentCollection"></Checkbox>
                  <Label
                    htmlFor="consentCollection"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    개인정보 수집 및 이용 동의
                  </Label>
                </li>
                <li>
                  <Checkbox id="consentProvision"></Checkbox>
                  <Label
                    htmlFor="consentProvision"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    개인정보 제3자 제공 동의
                  </Label>
                </li>
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
                <li>
                  <Checkbox id="consentCancellation"></Checkbox>
                  <Label
                    htmlFor="consentCancellation"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    취소/환불규정 동의
                  </Label>
                </li>
                <li>
                  <Label>결제시 유의사항</Label>
                </li>
                <li>결제 예정 금액</li>
                <li>
                  <Select onValueChange={() => {}} value={''}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="결제 방법" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={'creditCard'}>신용카드</SelectItem>
                        <SelectItem value={'accountTransfer'}>
                          계좌이체
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button type="submit">구매하기</Button>
        </div>
      </form>
    </Form>
  );
}
