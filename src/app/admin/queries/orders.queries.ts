import { FunctionProps } from './queries.type';
import ordersService from '@/services/orders.service';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ErrorResponse {
  message: string;
}

export function useOrderSaleProductMutation() {
  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: () => {
      toast.success('상품 구매가 완료 되었습니다.');
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
