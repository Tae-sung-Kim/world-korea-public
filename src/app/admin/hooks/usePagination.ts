import { PageFilter, PaginationProp } from '../queries/queries.type';
import { ObjectStrToNum } from '@/utils/number';
import { useSearchParams } from 'next/navigation';
import qs from 'qs';

export function usePagination() {
  const searchParams = useSearchParams();

  const {
    pageNumber = 1,
    pageSize = 10,
    filter = {},
  }: PaginationProp<PageFilter> = ObjectStrToNum(
    qs.parse(searchParams.toString())
  );

  return {
    pageNumber,
    pageSize,
    filter,
  };
}
