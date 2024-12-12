import {
  ErrorResponse,
  FunctionProps,
  PageFilter,
  PaginationProp,
} from './queries.type';
import {
  NameAndId,
  PaginationResponse,
  PaymentRequest,
  SaleProductBuyDisplayData,
} from '@/definitions';
import ordersService from '@/services/orders.service';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

const QUERY_KEY = 'admin-orders';

export function useOrderSaleProductMutation({
  onSuccess,
}: FunctionProps<SaleProductBuyDisplayData<string>>) {
  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: (data) => {
      onSuccess && onSuccess(data);
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    },
  });
}

export function useOrderListQuery(
  paginationParam?: PaginationProp<PageFilter>
) {
  const fallback: PaginationResponse<SaleProductBuyDisplayData<NameAndId>> = {
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
    queryKey: [QUERY_KEY, Object.values(paginationParam ?? {})],
    queryFn: () => {
      return ordersService.getOrderList(paginationParam ?? {});
    },
    placeholderData: keepPreviousData,
  });
  return data;
}

export function usePaymentMutation() {
  return useMutation({
    mutationFn: ({ orderId, paymentId }: PaymentRequest) =>
      ordersService.createPayment({ orderId, paymentId }),
  });
}
