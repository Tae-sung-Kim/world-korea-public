import { FunctionProps } from './queries.type';
import saleProductService from '@/services/sale-product.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

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
