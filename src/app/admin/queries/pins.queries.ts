import { FunctionProps, PageFilter, PaginationProp } from './queries.type';
import { PaginationResponse } from '@/definitions';
import { Pin, PinUsed } from '@/definitions/pin.type';
import pinsService from '@/services/pins.service';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

const QUERY_KEY = 'pins';

export function usePinsListQuery(paginationParam?: PaginationProp<PageFilter>) {
  const fallback: PaginationResponse<Pin> = {
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
    queryFn: () => pinsService.getListPin(paginationParam ?? {}),
    placeholderData: keepPreviousData,
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

export function useUsedPinMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, used }: { id: string; used: boolean }) =>
      pinsService.usedDatePin(id, used),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUsedPinListMutation({
  onSuccess,
  onError,
  onSettled,
}: FunctionProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pinNumberList }: PinUsed) =>
      pinsService.usedDatePinList({ pinNumberList }),
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('핀 사용이 완료 되었습니다.');
    },
    onError: (error: AxiosError<{ message: string; data: string[] }>) => {
      const errorMessage = error?.response?.data?.message
        ? `${error.response.data.message} ${
            Array.isArray(error.response.data.data)
              ? JSON.stringify(error.response.data.data)
              : ''
          }`
        : '핀 사용중 에러가 발생하였습니다.<br/>잠시 후 다시 시도해주세요.';
      onError && onError();
      toast.error(errorMessage);
    },
    onSettled,
  });
}

export function useUsedPinQrCodeQuery(pinNumber: string) {
  const fallback: boolean = false;

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY, pinNumber],
    queryFn: () => pinsService.usedPinQrCode(pinNumber),
    enabled: !!pinNumber,
  });

  return data;
}
