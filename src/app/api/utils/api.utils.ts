import { PaginationParams } from '@/definitions/pagination.type';
import { NextRequest } from 'next/server';
import qs from 'qs';

type QueryParams = {
  [key: string]:
    | string
    | {
        [key: string]: string | undefined;
      }
    | undefined;
} & PaginationParams;

export function getQueryParams(req: NextRequest): QueryParams {
  const parsedQuery = qs.parse(req.nextUrl.search.substr(1));
  const queryParams: Partial<QueryParams> = {};

  for (let key in parsedQuery) {
    const value = parsedQuery[key];

    if (typeof value === 'string') {
      if (key === 'pageNumber' || key === 'pageSize') {
        queryParams[key] = parseInt(value, 10);
      } else {
        queryParams[key] = value;
      }
    } else if (typeof value === 'object' && value !== null) {
      queryParams[key] = value as { [key: string]: string };
    }
  }

  return queryParams;
}
