import { ErrorResponse, FunctionProps } from './queries.type';
import { NotificationForm } from '@/definitions/notifications.type';
import notificationService from '@/services/notifications.service';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

const QUERY_KEY = 'notifications';

export function useCreateNotificationsMutation({
  onSuccess,
  onError,
  onSettled,
}: FunctionProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.createNotifications,
    onSuccess: () => {
      onSuccess && onSuccess();
      toast.success('팝업 등록이 완료 되었습니다.');
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }

      onError && onError();
    },
  });
}

export function useGetNotificationListQuery() {
  const fallback: NotificationForm[] = [];

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => notificationService.getNotificationList(),
  });

  return data;
}
