import { Product } from './product.type';

//단체 예약
export type GroupReservationItemProduct = {
  productId: string;
  productName: string;
};

export type GroupReservtionForm = {
  companyName: string; // 회사명
  contactPersonInfo: string; // 예약 담당자명 및 연락처
  appointmentDate: Date | string; // 방문 일자
  guideContactInfo: string; // 인솔자명 연락처
  numberOfPeopel: string; // 인원수
  nationality: string; // 국적
  productId: string; // 이용상품
  additionalOptions: string; // 추가 옵션
  mealCoupon: string; // 밀 쿠폰
  paymentType: string; // 결제 방법
  estimatedArrivalTime: string; //예상 도착시간 및 미팅장소
  vehicleAndTransportType: string; //차량번호 혹은 교통수단
};
