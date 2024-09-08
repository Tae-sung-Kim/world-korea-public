import { FunctionProps, PaginationProp } from './queries.type';
import { PaginationResponse, ProductFormData } from '@/definitions';
import productService from '@/services/product.service';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'admin-product';

export function useProductListQuery<T extends string>(
  paginationParam?: PaginationProp<T>
) {
  const fallback: PaginationResponse<ProductFormData> = {
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
      return productService.getProudctList(paginationParam ?? {});
    },
    placeholderData: keepPreviousData,
  });
  return data;
}
