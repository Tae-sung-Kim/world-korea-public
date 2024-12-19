import {
  FunctionProps,
  PageFilter,
  PaginationProp,
} from '@/app/admin/queries/queries.type';
import { GroupReservation, PaginationResponse } from '@/definitions';
import groupReservationService from '@/services/group-reservation.service';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'group-reservation';

export function useCreateGroupReservationMutation({
  onSuccess,
  onError,
  onSettled,
}: FunctionProps) {
  return useMutation({
    mutationFn: groupReservationService.createGroupReservation,
    onSuccess: () => {
      onSuccess && onSuccess();
      toast.success('단체 예약이 완료 되었습니다.');
    },
    onError: () => {
      onError && onError();
      toast.error(
        '단체 예약중 오류가 발생했습니다.<br/>잠시 후 다시 시도해주세요.'
      );
    },
    onSettled,
  });
}

export function useGroupReservationListQuery(
  paginationParam?: PaginationProp<PageFilter>
) {
  const fallback: PaginationResponse<GroupReservation> = {
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
      return groupReservationService.getGroupReservationList(
        paginationParam ?? {}
      );
    },

    placeholderData: keepPreviousData,
  });

  return data;
}

export function useGroupReservationDetailsQuery(id: string) {
  const fallback: Partial<GroupReservation> = {};

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => groupReservationService.getGroupReservationDetails(id),
  });

  return data;
}
