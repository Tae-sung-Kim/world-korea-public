'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GroupReservtionForm } from '@/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const GroupReservationFormSchema = z.object({
  companyName: z.string().min(0, '업체명은 필수 입니다.'),
  contactPersonInfo: z.string(), // 예약 담당자명 및 연락처
  guideContactInfo: z.string().min(0, '인솔자(가이드)정보는 필수 입니다.'), // 인솔자명 연락처
  numberOfPeopel: z.string().min(0, '인원수는 필수 입니다.'),
  nationality: z.string().min(0, '국적은 필수 입니다.'),
  product: z.object({}),
  mealCoupon: z.string(),
  paymentType: z.string(), //결제 방법 체크해야함
  estimatedArrivalTime: z.string(),
  vehicleAndTransportType: z.string(),

  pinNumberList: z
    .string()
    .refine((d) => d.length > 0, { message: '핀 번호를 입력해주세요' }),
});

export default function GroupReservationForm() {
  const groupReservationForm = useForm<GroupReservtionForm>({
    resolver: zodResolver(GroupReservationFormSchema),
    defaultValues: {
      companyName: '',
      contactPersonInfo: '',
      guideContactInfo: '',
      numberOfPeopel: '',
      nationality: '',
      product: {},
      additionalOptions: '',
      mealCoupon: '',
      paymentType: '',
      estimatedArrivalTime: '',
      vehicleAndTransportType: '',
    },
  });

  const handleSubmit = () => {
    console.log('예약 요청');
  };

  return (
    <div className="mt-10 mb-10">
      <h1 className="text-4xl font-bold text-center">[ 예약 요청서 ]</h1>
      <Form {...groupReservationForm}>
        <form
          onSubmit={groupReservationForm.handleSubmit(handleSubmit)}
          className="space-y-8"
        >
          <FormField
            control={groupReservationForm.control}
            name="companyName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>업체명</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={groupReservationForm.control}
            name="contactPersonInfo"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>예약 담당자 성함 및 연락처</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(가이드님 직접 예약일 경우 기재 안 하셔도 됩니다.)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={groupReservationForm.control}
            name="guideContactInfo"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>인솔자(가이드)님 성함 및 연락처</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={groupReservationForm.control}
            name="numberOfPeopel"
            render={({ field }) => {
              return (
                <FormItem>
                  <div className="flex">
                    <FormLabel>인원수(구매인원+인솔인원(TC포함))</FormLabel>
                    <FormLabel className="ml-auto text-red-500">
                      ※ 해외단체는 대소인 구분이 없으며, 36개월 미만은
                      무료입장이 가능합니다.{' '}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={groupReservationForm.control}
            name="nationality"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>국적</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={groupReservationForm.control}
            name="product"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>이용상품(메인상품)</FormLabel>
                  <FormControl>{/* 라디오 버튼으로 구성해야 함 */}</FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={groupReservationForm.control}
            name="additionalOptions"
            render={() => (
              <FormItem>
                <FormLabel>추가 옵션</FormLabel>
                <FormDescription>
                  (해당 없을 시 비워두시면 됩니다.)
                </FormDescription>
                {[
                  { label: '교복체험', id: 'schoolUniformTrial' },
                  {
                    label: '한강유람선(이크루즈)',
                    id: 'hanRiverCruise',
                    boardingTime: '',
                  },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={groupReservationForm.control}
                    name="additionalOptions"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              //   onCheckedChange={(checked) => {
                              //     return checked
                              //       ? field.onChange([...field.value, item.id])
                              //       : field.onChange(
                              //           field.value?.filter(
                              //             (value) => value !== item.id
                              //           )
                              //         );
                              //   }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={groupReservationForm.control}
            name="mealCoupon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>밀쿠폰</FormLabel>
                <FormDescription>
                  (해당 없을 시 비워두시면 됩니다.)
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="allOfSandwich" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        얼오브샌드위치
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mTable" />
                      </FormControl>
                      <FormLabel className="font-normal">엠테이블</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="multiUse" />
                      </FormControl>
                      <FormLabel className="font-normal">겸용</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={groupReservationForm.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>결제 방법</FormLabel>
                <FormDescription>
                  (현금 혹은 입금의 경우, 아래 메모란에 세금계산서 및 현금영수증
                  발급여부와 발급하실 사업자번호 혹은 현금영수증 번호를 기재
                  부탁드립니다.)
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="dayOfCardPayment" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        당일 카드결제
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cashPayment" />
                      </FormControl>
                      <FormLabel className="font-normal">현금 결제</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="preDeposit" />
                      </FormControl>
                      <FormLabel className="font-normal">사전 입금</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <Input placeholder="현금 및 입금일때 활성화" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={groupReservationForm.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>예상 도착시간 및 미팅장소</FormLabel>
                <FormDescription>
                  (미정일 경우 비워두시고 확정되면 연락부탁드립니다.)
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mainEntrance" />
                      </FormControl>
                      <FormLabel className="font-normal">정문</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="southEntrance" />
                      </FormControl>
                      <FormLabel className="font-normal">남문</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="lotteWorldBusPark" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        롯데월드 버스 주차장
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="seoulSkyEntrance" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        서울스카이 입구
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="etc" />
                      </FormControl>
                      <FormLabel className="font-normal">기타</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <Input placeholder="현금 및 입금일때 활성화" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={groupReservationForm.control}
            name="vehicleAndTransportType"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>차량번호 혹은 교통수단</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="(ex :  경기 00 가 0000 혹은 지하철 이동)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex justify-center pt-4">
            <Button>예약 신청</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
