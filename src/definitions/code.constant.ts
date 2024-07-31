// 상품 상태 코드
export const PRODUCT_STATUSES = [
  { code: 'ON_SALE', description: '판매중' },
  { code: 'PRIVATE', description: '비공개' },
  { code: 'OUT_OF_STOCK', description: '일시품절' },
] as const;

// 결제 방법 코드
export const PAYMENT_METHODS = [
  { code: 'CARD', description: '카드' },
  { code: 'BANK_TRANSFER', description: '무통장' },
] as const;

// 파트너 사용 상태 코드
export const PARTNER_ACCESS_STATUSES = [
  { code: 'ENABLED', description: '접근허용' },
  { code: 'DISABLED', description: '접근불가' }, // 예시로 접근불가 추가
] as const;

// 파트너 목록 필드 코드
export const PARTNER_LIST_FIELDS = [
  { code: 'RESERVATION_NUMBER', description: '예약번호' },
  { code: 'RESERVATION_DATE', description: '예약일' },
  { code: 'COMPANY_NAME', description: '업체명' },
  { code: 'CUSTOMER_NAME', description: '고객명' },
  { code: 'QUANTITY', description: '수량' },
  { code: 'TOTAL_AMOUNT', description: '총금액' },
  { code: 'PURCHASE_DATE', description: '구매일' },
] as const;

// 파트너 기능 코드
export const PARTNER_FEATURES = [
  { code: 'SAVE_QR', description: 'QR코드저장' },
  { code: 'SAVE_EXCEL', description: '엑셀저장' },
  { code: 'EMAIL', description: '이메일' },
  { code: 'PRINT', description: '출력' },
  { code: 'SMS', description: 'SMS' },
] as const;
