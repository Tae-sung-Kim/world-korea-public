'use client';

import DetailTitle from '@/app/components/common/detail-title.component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { GroupReservationForm } from '@/definitions';
import {
  ADDITIONAL_OPTIONS,
  ESTIMATED_ARRIVAL_TIME,
  MEAL_COUPON,
  PAYMENT_TYPE,
} from '@/definitions/group-reservation.constant';
import { useGroupReservationDetailsQuery } from '@/queries';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface GroupReservationDetailClientProps {
  id: string;
}

export default function GroupReservationDetailClient({
  id,
}: GroupReservationDetailClientProps) {
  const groupReservation = useGroupReservationDetailsQuery(id);
  const customData = groupReservation.customData as GroupReservationForm;

  const getLabel = (
    value: string,
    options: { value: string; label: string }[]
  ) => {
    return options.find((option) => option.value === value)?.label || value;
  };

  const additionalOptionsLabels = ADDITIONAL_OPTIONS.filter((option) =>
    customData?.additionalOptions?.includes(option.id)
  )
    .map((option) => option.label)
    .join(', ');

  return (
    <div className="min-w-[280px]">
      <DetailTitle title="단체 예약 상세" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="min-w-0 hover:shadow-md transition-shadow duration-200">
          <CardHeader className="p-3 sm:p-4 lg:p-6 border-b bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500 rounded-full" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  업체명
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {customData?.companyName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  방문 일자
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {customData?.appointmentDate &&
                    format(new Date(customData.appointmentDate), 'PPP', {
                      locale: ko,
                    })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  인원수
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {customData?.numberOfPeopel}명
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  국적
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {customData?.nationality}
                </p>
              </div>
              {customData?.memo && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                    메모
                  </h3>
                  <Textarea
                    value={customData.memo}
                    readOnly
                    className="resize-none bg-gray-50 min-h-[100px]"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 hover:shadow-md transition-shadow duration-200">
          <CardHeader className="p-3 sm:p-4 lg:p-6 border-b bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-4 bg-green-500 rounded-full" />
              연락처 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  예약 담당자 성함 및 연락처
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {customData?.contactPersonInfo}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  인솔자(가이드)님 성함 및 연락처
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {customData?.guideContactInfo}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 min-w-0 hover:shadow-md transition-shadow duration-200">
          <CardHeader className="p-3 sm:p-4 lg:p-6 border-b bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-4 bg-purple-500 rounded-full" />
              상품 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  이용상품(메인상품)
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {customData?.productName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  추가 옵션
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {additionalOptionsLabels || '추가 옵션 없음'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  밀쿠폰
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {getLabel(customData?.mealCoupon, MEAL_COUPON)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 hover:shadow-md transition-shadow duration-200">
          <CardHeader className="p-3 sm:p-4 lg:p-6 border-b bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full" />
              결제 및 도착 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  결제 방법
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {getLabel(customData?.paymentType?.type, PAYMENT_TYPE)}
                </p>
                {customData?.paymentType?.memo && (
                  <p className="text-sm text-gray-500 mt-1.5 px-3 py-2 bg-gray-50/80 rounded-md">
                    메모: {customData.paymentType.memo}
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  예상 도착시간 및 미팅장소
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {getLabel(
                    customData?.estimatedArrivalTime?.type,
                    ESTIMATED_ARRIVAL_TIME
                  )}
                </p>
                {customData?.estimatedArrivalTime?.memo && (
                  <p className="text-sm text-gray-500 mt-1.5 px-3 py-2 bg-gray-50/80 rounded-md">
                    메모: {customData.estimatedArrivalTime.memo}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 hover:shadow-md transition-shadow duration-200">
          <CardHeader className="p-3 sm:p-4 lg:p-6 border-b bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-4 bg-red-500 rounded-full" />
              교통 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">
                  차량번호 혹은 교통수단
                </h3>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md">
                  {customData?.vehicleAndTransportType}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
