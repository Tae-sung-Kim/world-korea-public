export type GroupReservation = {
  _id: string;
  name: string;
  phoneNumber: string;
  customData: Record<string, unknown>;
  usedAt: Date;
  createdAt: Date;
};

// 단체 예약
export type GroupReservationItemProduct = {
  productId: string;
  productName: string;
};

export type GroupReservationForm = {
  companyName: string; // 회사명
  contactPersonInfo: string; // 예약 담당자명
  appointmentDate: Date | string; // 방문 일자
  guideContactInfo: string; // 예약 담당자 연락처
  numberOfPeopel: string; // 인원수
  nationality: string; // 국적
  productId: string; // 이용상품
  productName: string;
  additionalOptions: string[]; // 추가 옵션
  mealCoupon: string; // 밀 쿠폰
  paymentType: {
    type: string;
    memo?: string;
  }; // 결제 방법
  estimatedArrivalTime: {
    type: string;
    memo?: string;
  }; // 예상 도착시간 및 미팅장소
  addedVisitDate: Date | string; // 추가옵션 방문 일자
  vehicleAndTransportType: string; // 차량번호 혹은 교통수단
  memo?: string; // 비고
};
