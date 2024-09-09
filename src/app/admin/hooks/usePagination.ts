import { PageFilter, PaginationProp } from '../queries/queries.type';
import { ObjectStrToNum } from '@/utils/number';
import { useSearchParams } from 'next/navigation';
import qs from 'qs';

export function usePagination(
  { queryFilters }: { queryFilters: PageFilter } = { queryFilters: {} }
) {
  const searchParams = useSearchParams();

  const {
    pageNumber = 1,
    pageSize = 10,
    filter = {},
  }: PaginationProp<typeof queryFilters> = ObjectStrToNum(
    qs.parse(searchParams.toString())
  );

  return {
    pageNumber,
    pageSize,
    filter,
  };
}
