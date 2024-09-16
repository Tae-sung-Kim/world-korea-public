import { FunctionProps, PageFilter, PaginationProp } from './queries.type';
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

export function useProductListQuery(
  paginationParam?: PaginationProp<PageFilter>
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

export function useDetailProductQuery(id: string) {
  const fallback: Partial<ProductFormData> = {};

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => productService.detailProudct(id),
  });

  return data;
}

export function useCreateProductMutation({
  onSuccess,
  onError,
  onSettled,
}: FunctionProps) {
  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      onSuccess && onSuccess();
      toast.success('상품이 등록 되었습니다.');
    },
    onError,
    onSettled,
  });
}

export function useUpdateProductMutation({
  onSuccess,
  onError,
  onSettled,
}: FunctionProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.updateProduct,
    onSuccess: () => {
      onSuccess && onSuccess();
      toast.success('상품이 수정 되었습니다.');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError,
    onSettled,
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('상품이 삭제 되었습니다.');
    },
  });
}
