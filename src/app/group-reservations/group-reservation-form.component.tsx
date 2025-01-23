'use client';

import { useReservableSaleProductQuery } from '../admin/queries';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GroupReservation, GroupReservationForm } from '@/definitions';
import {
  ADDITIONAL_OPTIONS,
  ESTIMATED_ARRIVAL_TIME,
  MEAL_COUPON,
  PAYMENT_TYPE,
} from '@/definitions/group-reservation.constant';
import { useCoolSMS } from '@/hooks/useCoolSMS';
import { cn } from '@/lib/utils';
import {
  useCreateGroupReservationMutation,
  useGroupReservationDetailsQuery,
  useUpdateGroupReservationMutation,
} from '@/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { BsCalendarDate } from 'react-icons/bs';
import { z } from 'zod';

const GroupReservationFormSchema = z.object({
  companyName: z.string().min(1, '업체명은 필수 입니다.'),
  contactPersonInfo: z.string().min(1, '담당자명은 필수 입니다.'), // 예약 담당자명
  appointmentDate: z
    .union([z.date(), z.string()])
    .refine((val) => val !== null && val !== undefined && val !== '', {
      message: '방문 일자는 필수입니다.',
    }), // 방문 일자
  addedVisitDate: z.union([z.date(), z.string()]),
  guideContactInfo: z.string().min(1, '연락처는 필수 입니다.'), // 예약 담당자 연락처
  numberOfPeopel: z.string().min(1, '인원수는 필수 입니다.'),
  nationality: z.string().min(1, '국적은 필수 입니다.'),
  productId: z.string().min(1, '상품은 필수 입니다.'),
  productName: z.string(),
  additionalOptions: z.array(z.string()), // 추가옵션
  mealCoupon: z.string(),
  paymentType: z
    .object({
      // 결제 방법
      type: z.string(),
      memo: z.string().optional(),
    })
    .refine((d) => !!d.type, {
      message: '결제 방법을 선택해 주세요.',
    }),
  estimatedArrivalTime: z.object({
    // 예상 도착 시간
    type: z.string().optional(),
    memo: z.string().optional(),
  }),
  vehicleAndTransportType: z.string(),
});

type addedGroupReservation = GroupReservationForm & Partial<GroupReservation>;

export default function GroupReservationFormClient({
  groupReservationId,
}: {
  groupReservationId?: string;
}) {
  // 예약 가능 상품
  const reservableSaleProduct = useReservableSaleProductQuery();
  const { onSendCoolSMS } = useCoolSMS();

  // 단체 예약 상세
  const detailGroupReservation = useGroupReservationDetailsQuery(
    groupReservationId ?? ''
  );

  // 단체 예약 수정
  const updateGroupReservationMutation = useUpdateGroupReservationMutation({});

  // 단체 예약 req
  const createGroupReservationMutation = useCreateGroupReservationMutation({
    onSuccess: async () => {
      const {
        companyName,
        contactPersonInfo,
        guideContactInfo,
        appointmentDate,
        paymentType,
        numberOfPeopel,
        productName,
      } = groupReservationForm.getValues();

      await onSendCoolSMS({
        subject: '단체 예약 완료',
        to: guideContactInfo.replace(/-/g, ''),
        text: `${companyName}단체 예약 완료
인솔자: ${contactPersonInfo}
상품명: ${productName}
결제방법: ${PAYMENT_TYPE.find((f) => f.value === paymentType.type)?.label}
방문예정일: ${format(appointmentDate, 'yyyy. M. dd')}
수량: ${numberOfPeopel} 개 `,
      });

      groupReservationForm.reset();
    },
  });

  const defaultValues: addedGroupReservation = {
    companyName: '',
    contactPersonInfo: '',
    appointmentDate: '',
    addedVisitDate: '',
    guideContactInfo: '',
    numberOfPeopel: '',
    nationality: '',
    productId: '',
    productName: '',
    additionalOptions: [],
    mealCoupon: '',
    paymentType: {
      type: '',
      memo: '',
    },
    estimatedArrivalTime: {
      type: '',
      memo: '',
    },
    vehicleAndTransportType: '',
  };

  const groupReservationForm = useForm<addedGroupReservation>({
    resolver: zodResolver(GroupReservationFormSchema),
    defaultValues,
  });

  // 추가 옵션
  const handleAdditionalOptionsChange = (
    checked: boolean,
    id: string,
    field: ControllerRenderProps
  ) => {
    if (checked) {
      field.onChange([...field.value, id]);
    } else {
      field.onChange(field.value?.filter((value: string) => value !== id));
    }
  };

  // 이용상품
  const handleProductChange = (value: string, field: ControllerRenderProps) => {
    field.onChange(value);

    const productName = Array.isArray(reservableSaleProduct)
      ? reservableSaleProduct.find((f) => f._id === value)?.name
      : '';

    groupReservationForm.setValue('productName', productName ?? '');
  };

  const handleSubmit = () => {
    if (groupReservationId) {
      updateGroupReservationMutation.mutate({
        id: groupReservationId,
        data: groupReservationForm.getValues(),
      });
    } else {
      createGroupReservationMutation.mutate(groupReservationForm.getValues());
    }
  };

  useEffect(() => {
    if (
      !detailGroupReservation ||
      Object.keys(detailGroupReservation).length < 1
    ) {
      return;
    }

    const { customData, ...other } = detailGroupReservation;

    const data = {
      ...other,
      ...(customData ?? {}),
    };

    groupReservationForm.reset(data);
  }, [detailGroupReservation, groupReservationForm]);

  return (
    <Form {...groupReservationForm}>
      <form
        onSubmit={groupReservationForm.handleSubmit(handleSubmit)}
        className="max-w-6xl mx-auto space-y-8"
      >
        {!groupReservationId && (
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-purple-200"></div>
            </div>
            <div className="relative flex justify-center">
              <h1 className="px-8 py-4 text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl shadow-lg">
                단체 예약 요청서
              </h1>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormField
            control={groupReservationForm.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="bg-gray-50 p-4 rounded-lg">
                <FormLabel className="text-base font-medium">업체명</FormLabel>
                <FormControl>
                  <Input
                    placeholder="업체명을 입력해주세요"
                    className="bg-white border-gray-200 focus:border-purple-500"
                    {...field}
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
                  인솔자(가이드)님 성함
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white border-gray-200 focus:border-purple-500"
                    {...field}
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
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'yyyy. M. dd')
                        ) : (
                          <span>날짜를 선택해주세요</span>
                        )}
                        <BsCalendarDate className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={ko}
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          // 선택된 날짜의 자정(00:00:00)으로 설정
                          const selectedDate = new Date(date);
                          selectedDate.setHours(0, 0, 0, 0);
                          field.onChange(selectedDate.toISOString());
                        } else {
                          field.onChange(date);
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  롯데월드 패키지는 모두 당일 이용이 기본입니다.
                </FormDescription>
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
                  인솔자(가이드)님 연락처
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white border-gray-200 focus:border-purple-500"
                    {...field}
                  />
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
                <FormLabel className="text-base font-medium">인원수</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(구매인원+인솔인원(TC포함))"
                    className="bg-white border-gray-200 focus:border-purple-500"
                    {...field}
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
                  <Input
                    className="bg-white border-gray-200 focus:border-purple-500"
                    {...field}
                  />
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
                    onValueChange={(value) =>
                      handleProductChange(value, { ...field })
                    }
                    value={field.value || ''}
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
          <div>
            <FormField
              control={groupReservationForm.control}
              name="additionalOptions"
              render={() => (
                <FormItem className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <FormLabel className="text-base font-medium">
                      추가 옵션
                    </FormLabel>
                    <FormDescription>
                      (해당 없을 시 비워두시면 됩니다.)
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ADDITIONAL_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        className="bg-white p-3 rounded border"
                      >
                        <FormField
                          key={option.id}
                          control={groupReservationForm.control}
                          name="additionalOptions"
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`checkbox-${option.id}`}
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked: boolean) =>
                                  handleAdditionalOptionsChange(
                                    checked,
                                    option.id,
                                    {
                                      ...field,
                                    }
                                  )
                                }
                              />
                              <label
                                htmlFor={`checkbox-${option.id}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {option.label}
                              </label>
                            </div>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupReservationForm.control}
              name="addedVisitDate"
              render={({ field }) => (
                <FormItem className="bg-gray-50 p-4 rounded-lg">
                  <FormLabel className="text-base font-medium">
                    추가 옵션 방문 일자
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'yyyy. M. dd')
                          ) : (
                            <span>날짜를 선택해주세요</span>
                          )}
                          <BsCalendarDate className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        locale={ko}
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            // 선택된 날짜의 자정(00:00:00)으로 설정
                            const selectedDate = new Date(date);
                            selectedDate.setHours(0, 0, 0, 0);
                            field.onChange(selectedDate.toISOString());
                          } else {
                            field.onChange(date);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    추가 옵션은 별도 일자에 이용하실 경우 기재해주시면 됩니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={groupReservationForm.control}
            name="mealCoupon"
            render={({ field }) => (
              <FormItem className="bg-gray-50 p-4 rounded-lg">
                <FormLabel className="text-base font-medium">밀쿠폰</FormLabel>
                <FormDescription>
                  (해당 없을 시 비워두시면 됩니다.)
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ''}
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
                        <FormLabel className="font-normal">{d.label}</FormLabel>
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
                  <div className="space-y-4">
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange({
                          type: value,
                          // type이 변경될 때 memo 초기화
                          memo: ['cashPayment', 'preDeposit'].includes(value)
                            ? field.value?.memo
                            : '',
                        })
                      }
                      value={field.value?.type || ''}
                      className="flex flex-col space-y-1"
                    >
                      {PAYMENT_TYPE.map((d) => (
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
                    <Input
                      placeholder="추가 메모"
                      value={field.value?.memo || ''}
                      disabled={
                        !['cashPayment', 'preDeposit'].includes(
                          field.value?.type
                        )
                      }
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          memo: e.target.value,
                        })
                      }
                      className="bg-white border-gray-200 focus:border-purple-500"
                    />
                  </div>
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
                  <div className="space-y-4">
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange({
                          type: value,
                          // etc가 아닐 때만 memo 초기화
                          memo: value === 'etc' ? field.value?.memo : '',
                        })
                      }
                      value={field.value?.type || ''}
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
                          <FormLabel className="font-normal">
                            {d.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                    <Input
                      placeholder="추가 메모"
                      value={field.value?.memo || ''}
                      disabled={!('etc' === field.value?.type)}
                      onChange={(e) =>
                        field.onChange({ ...field.value, memo: e.target.value })
                      }
                      className="bg-white border-gray-200 focus:border-purple-500"
                    />
                  </div>
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
                    className="bg-white border-gray-200 focus:border-purple-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center p-4">
          {groupReservationId ? (
            <Button type="submit" variant="submit">
              예약 수정하기
            </Button>
          ) : (
            <Button
              size="lg"
              type="submit"
              className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
            >
              예약 신청하기
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
