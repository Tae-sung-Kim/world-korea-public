import { FunctionProps, PageFilter, PaginationProp } from './queries.type';
import {
  PackageDetailName,
  PaginationResponse,
  ProductFormData,
  SaleProductFormData,
} from '@/definitions';
import saleProductService from '@/services/sale-product.service';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
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
  const fallback: Partial<SaleProductFormData<ProductFormData>> = {};

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => saleProductService.getDetailSaleProudct(id),
  });

  return data;
}
