import { FunctionProps, PageFilter, PaginationProp } from './queries.type';
import {
  PackageDetailName,
  PaginationResponse,
  ProductDisplayData,
  SaleProductFormData,
} from '@/definitions';
import saleProductService from '@/services/sale-product.service';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'admin-sale-product';

export function useSaleProductListQuery(
  paginationParam?: PaginationProp<PageFilter>
) {
  const fallback: PaginationResponse<SaleProductFormData<PackageDetailName>> = {
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
      return saleProductService.getSaleProudctList(paginationParam ?? {});
    },
    placeholderData: keepPreviousData,
  });
  return data;
}

export function useCreateSaleProductMutation({
  onSuccess,
  onError,
  onSettled,
}: FunctionProps) {
  return useMutation({
    mutationFn: saleProductService.createSaleProduct,
    onSuccess: () => {
      onSuccess && onSuccess();
      toast.success('판매 상품이 등록 되었습니다.');
    },
    onError,
    onSettled,
  });
}

export function useDetailSaleProductQuery(id: string) {
  const fallback: Partial<SaleProductFormData<ProductDisplayData>> = {};

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => saleProductService.getDetailSaleProudct(id),
    enabled: !!id,
  });

  return data;
}

export function useReservableSaleProductQuery() {
  const fallback: SaleProductFormData<ProductDisplayData>[] = [];

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY, 'reservable'],
    queryFn: () => saleProductService.getReservationSaleProductList(),
    gcTime: 0,
    staleTime: 0, // 데이터를 즉시 오래된 것으로 표시
    refetchOnMount: true,
    refetchOnWindowFocus: true, // 추가로 윈도우 포커스 시 리패치
  });

  return data;
}

export function useUpdateSaleProductMutation({
  onSuccess,
  onError,
  onSettled,
}: FunctionProps) {
  return useMutation({
    mutationFn: saleProductService.updateSaleProduct,
    onSuccess: () => {
      onSuccess && onSuccess();
      toast.success('판매 상품이 수정 되었습니다.');
    },
    onError,
    onSettled,
  });
}

export function useDeleteSaleProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => saleProductService.deleteSaleProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('판매 상품이 삭제 되었습니다.');
    },
  });
}
