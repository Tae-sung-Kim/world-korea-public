import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import {
  PaginationResponse,
  SaleProductBuyDisplayData,
  UserInfo,
} from '@/definitions';
import ordersService from '@/services/orders.service';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const QUERY_KEY = 'orders';

export function useMyOrderListQuery(
  paginationParam?: PaginationProp<PageFilter>
) {
  const fallback: PaginationResponse<SaleProductBuyDisplayData<UserInfo>> = {
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

  const { data = fallback } = useQuery({
    queryKey: ['my-' + QUERY_KEY, Object.values(paginationParam ?? {})],
    queryFn: () => {
      return ordersService.getUserOrderList(paginationParam ?? {});
    },
    placeholderData: keepPreviousData,
  });
  return data;
}

// export function usePartnerOrderListQuery(
//   paginationParam?: PaginationProp<PageFilter>
// ) {
//   const fallback: PaginationResponse<SaleProductBuyDisplayData<UserInfo>> = {
//     pageNumber: -1,
//     pageSize: -1,
//     list: [],
//     totalItems: -1,
//     totalPages: -1,
//     hasPreviousPage: false,
//     hasNextPage: false,
//     previousPage: -1,
//     nextPage: -1,
//     startIndex: -1,
//     endIndex: -1,
//   };

//   const { data = fallback } = useQuery({
//     queryKey: ['partner-' + QUERY_KEY, Object.values(paginationParam ?? {})],
//     queryFn: () => {
//       return ordersService.getPartnerOrderList(paginationParam ?? {});
//     },
//     placeholderData: keepPreviousData,
//   });
//   return data;
// }
