import { FunctionProps } from './queries.type';
import { NotificationForm } from '@/definitions/notifications.type';
import notificationService from '@/services/notifications.service';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'notifications';

export function useCreateNotificationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.createNotifications,
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
