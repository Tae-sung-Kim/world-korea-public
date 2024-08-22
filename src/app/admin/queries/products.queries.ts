import { ProductFormData } from '@/definitions';
import productService from '@/services/product.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

type FunctionProps = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

const QUERY_KEY = 'admin-product';

export function useProductListQuery() {
  const fallback: ProductFormData[] = [];

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: productService.getProudctList,
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
  return useMutation({
    mutationFn: productService.updateProduct,
    onSuccess: () => {
      onSuccess && onSuccess();
      toast.success('상품이 수정 되었습니다.');
    },
    onError,
    onSettled,
  });
}
