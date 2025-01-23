import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import { PaginationResponse, Pin } from '@/definitions';
import pinsService from '@/services/pins.service';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const QUERY_KEY = 'partner-pins';

export function usePartnerPinsListQuery(
  paginationParam?: PaginationProp<PageFilter>
) {
  const fallback: PaginationResponse<Pin> = {
    pageNumber: -1,
    pageSize: -1,
    list: [],
    totalItems: -1,
    totalPages: -1,
    hasPreviousPage: false,
    hasNextPage: false,
    previousPage: -1,
    nextPage: -1,
    startIndex: -1,
    endIndex: -1,
  };

  const { data = fallback, refetch } = useQuery({
    queryKey: [QUERY_KEY, Object.values(paginationParam ?? {})],
    queryFn: () => pinsService.getPartnerListPin(paginationParam ?? {}),
    placeholderData: keepPreviousData,
  });

  return { data, refetch };
}
