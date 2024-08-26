import { Pin } from '@/definitions/pins.type';
import pinsService from '@/services/pins.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type FunctionProps = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

const QUERY_KEY = 'pins';

export function usePinsListQuery() {
  const fallback: Pin[] = [];

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: pinsService.getListPin,
  });

  return data;
}

export function useDetailPinsQuery(id: string) {
  const fallback: Pin[] = [];

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => pinsService.detailPin(id),
  });

  return data;
}

export function useCreatePinMutation({
  onSuccess,
  onError,
  onSettled,
}: FunctionProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pinsService.createPin,
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('핀 생성이 완료 되었습니다.');
    },
    onError: () => {
      onError && onError();
      toast.error(
        '핀 생성중 에러가 발생했습니다.<br/>잠시 후 다시 시도해주세요.'
      );
    },
    onSettled,
  });
}
export function useDeletePinMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pinsService.deletePin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
