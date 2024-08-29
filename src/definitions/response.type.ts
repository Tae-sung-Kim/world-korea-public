export type PaginationResponse<T> = {
  pageNumber: number; // 현재 페이지 번호
  pageSize: number; // 한 페이지에 포함된 항목 수
  list: T[];
  totalItems: number; // 데이터의 총 항목 수
  totalPages: number; // 전체 페이지 수
  hasPreviousPage: boolean; // 이전 페이지가 있는지 여부
  hasNextPage: boolean; // 다음 페이지가 있는지 여부
  previousPage: null | number; // 이전 페이지 번호
  nextPage: null | number; // 다음 페이지 번호
  startIndex: number; // 현재 페이지의 시작 인덱스
  endIndex: number; // 현재 페이지의 마지막 인덱스
};
