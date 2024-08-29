import { PaginationParams } from '@/definitions/pagination.type';
import { NextRequest } from 'next/server';

type QueryParams = {
  [key: string]: string;
} & PaginationParams;

export function getQueryParams(req: NextRequest): QueryParams {
  const { searchParams } = req.nextUrl;
  const queryParams: QueryParams = {};

  // searchParams를 순회하여 모든 쿼리 파라미터를 객체로 변환
  searchParams.forEach((value, key) => {
    if (key === 'pageNumber' || key === 'pageSize') {
      queryParams[key] = parseInt(value, 10);
    } else {
      queryParams[key] = value;
    }
  });

  return queryParams;
}
