import { User } from '@/definitions';
import userService from '@/services/user.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'users';

export function useUserListQuery() {
  const fallback: User[] = [];

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: userService.getUserList,
    gcTime: 0,
  });

  return data;
}

export function useUserDetailQuery(userId: string) {
  const fallback: User = {} as User;

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY, userId],
    queryFn: () => userService.getUserById(userId),
  });

  return data;
}

export function useUpdateUserMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] });
      toast.success('회원 정보를 수정하였습니다.');
    },
  });
}
