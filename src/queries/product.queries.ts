import { PageFilter, PaginationProp } from '@/app/admin/queries/queries.type';
import {
  PackageDetailName,
  PaginationResponse,
  ProductDisplayData,
  SaleProductFormData,
} from '@/definitions';
import saleProductService from '@/services/sale-product.service';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'sale-product';

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

export function useDetailSaleProductQuery(id: string) {
  const fallback: Partial<SaleProductFormData<ProductDisplayData>> = {};

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => saleProductService.getDetailSaleProudct(id),
  });

  return data;
}
