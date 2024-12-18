import { FunctionProps } from '@/app/admin/queries/queries.type';
import groupReservationService from '@/services/group-reservation.service';
import { useMutation } from '@tanstack/react-query';
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
