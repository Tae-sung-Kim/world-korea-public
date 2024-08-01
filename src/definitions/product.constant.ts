// 상품 상태 타입 정의
export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  HIDDEN: 'hidden',
  OUT_OF_STOCK: 'outOfStock',
} as const;

// 상품 상태 타입 정의
export const PRODUCT_STATUS_MESSAGE = {
  available: '판매중',
  hidden: '비공개',
  outOfStock: '일시품절',
} as const;
