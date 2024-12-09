'use client';

import useReservableSaleProductQuery from '../admin/queries/sale-product.queries';
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
import {
  ADDITIONAL_OPTIONS,
  ESTIMATED_ARRIVAL_TIME,
  MEAL_COUPON,
  PAYMENT_TYPE,
} from '@/definitions/group-reservation.constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const GroupReservationFormSchema = z.object({
  companyName: z.string().min(0, '업체명은 필수 입니다.'),
  contactPersonInfo: z.string(), // 예약 담당자명 및 연락처
  appointmentDate: z.date().or(z.string()), //방문 일자
  guideContactInfo: z.string().min(0, '인솔자(가이드)정보는 필수 입니다.'), // 인솔자명 연락처
  numberOfPeopel: z.string().min(0, '인원수는 필수 입니다.'),
  nationality: z.string().min(0, '국적은 필수 입니다.'),
  productId: z.string().min(0, '상품은 필수 입니다.'),
  mealCoupon: z.string(),
  paymentType: z.string(), //결제 방법 체크해야함
  estimatedArrivalTime: z.string(),
  vehicleAndTransportType: z.string(),
});

export default function GroupReservationForm() {
  const reservableSaleProduct = useReservableSaleProductQuery();

  const groupReservationForm = useForm<GroupReservtionForm>({
    resolver: zodResolver(GroupReservationFormSchema),
    defaultValues: {
      companyName: '',
      contactPersonInfo: '',
      appointmentDate: '',
      guideContactInfo: '',
      numberOfPeopel: '',
      nationality: '',
      productId: '',
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
      <div className="relative text-center mb-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <h1 className="relative inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white text-3xl md:text-4xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200">
          예약 요청서
        </h1>
      </div>
      <Form {...groupReservationForm}>
        <form
          onSubmit={groupReservationForm.handleSubmit(handleSubmit)}
          className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <FormField
              control={groupReservationForm.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    업체명
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="업체명을 입력해주세요"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="contactPersonInfo"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    예약 담당자 성함 및 연락처
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(가이드님 직접 예약일 경우 기재 안 하셔도 됩니다.)"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    방문 일자
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(롯데월드 패키지는 모두 당일 이용이 기본이며, 추가 옵션은 별도 일자에 이용하실 경우 기재해주시면 됩니다. )"
                      {...field}
                      value={
                        typeof field.value === 'string'
                          ? field.value
                          : field.value.toString()
                      }
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="guideContactInfo"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    인솔자(가이드)님 성함 및 연락처
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="numberOfPeopel"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex">
                    <FormLabel className="text-base font-medium">
                      인원수
                    </FormLabel>
                    <FormLabel className="ml-auto text-red-500">
                      ※ 해외단체는 대소인 구분이 없으며, 36개월 미만은
                      무료입장이 가능합니다.
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="(구매인원+인솔인원(TC포함))"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">국적</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="productId"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    이용상품(메인상품)
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {Array.isArray(reservableSaleProduct) &&
                        reservableSaleProduct.map((d) => (
                          <FormItem
                            key={d._id}
                            className="flex items-center space-x-3 space-y-0 bg-white p-3 rounded border"
                          >
                            <FormControl>
                              <RadioGroupItem value={d._id ?? ''} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {d.name}
                            </FormLabel>
                          </FormItem>
                        ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="additionalOptions"
              render={() => (
                <FormItem className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    추가 옵션
                  </FormLabel>
                  <FormDescription>
                    (해당 없을 시 비워두시면 됩니다.)
                  </FormDescription>
                  {ADDITIONAL_OPTIONS.map((d) => (
                    <FormField
                      key={d.id}
                      control={groupReservationForm.control}
                      name="additionalOptions"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={d.id}
                            className="flex flex-row items-start space-x-3 space-y-0 bg-white p-3 rounded border"
                          >
                            <FormControl>
                              <Checkbox checked={field.value?.includes(d.id)} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {d.label}
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
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    밀쿠폰
                  </FormLabel>
                  <FormDescription>
                    (해당 없을 시 비워두시면 됩니다.)
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {MEAL_COUPON.map((d) => (
                        <FormItem
                          key={d.value}
                          className="flex items-center space-x-3 space-y-0 bg-white p-3 rounded border"
                        >
                          <FormControl>
                            <RadioGroupItem value={d.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {d.label}
                          </FormLabel>
                        </FormItem>
                      ))}
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
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    결제 방법
                  </FormLabel>
                  <FormDescription>
                    (현금 혹은 입금의 경우, 이 메모란에 세금계산서 및 현금영수증
                    발급여부와 발급하실 사업자번호 혹은 현금영수증 번호를 기재
                    부탁드립니다.)
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {PAYMENT_TYPE.map((d) => (
                        <FormItem
                          key={d.value}
                          className="flex items-center bg-white p-3 rounded border"
                        >
                          <div className="flex items-center min-w-0">
                            <FormControl>
                              <RadioGroupItem value={d.value} />
                            </FormControl>
                            <FormLabel className="ml-2 font-normal whitespace-nowrap">
                              {d.label}
                            </FormLabel>
                          </div>
                          {d.etc && (
                            <FormControl className="flex-1 ml-4">
                              <Input />
                            </FormControl>
                          )}
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="estimatedArrivalTime"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    예상 도착시간 및 미팅장소
                  </FormLabel>
                  <FormDescription>
                    (미정일 경우 비워두시고 확정되면 연락부탁드립니다.)
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {ESTIMATED_ARRIVAL_TIME.map((d) => (
                        <FormItem
                          key={d.value}
                          className="flex items-center space-x-3 space-y-0 bg-white p-3 rounded border"
                        >
                          <FormControl>
                            <RadioGroupItem value={d.value} />
                          </FormControl>
                          <FormLabel className="font-normal whitespace-nowrap">
                            {d.label}
                          </FormLabel>
                          {d.value === 'etc' && (
                            <FormControl>
                              <Input
                                placeholder="기타 장소"
                                className="flex-1"
                              />
                            </FormControl>
                          )}
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="vehicleAndTransportType"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    차량번호 혹은 교통수단
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(ex :  경기 00 가 0000 혹은 지하철 이동)"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center pt-6">
            <Button className="px-8 py-2">예약 신청</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
