import { FunctionProps, PageFilter, PaginationProp } from './queries.type';
import { PaginationResponse, User } from '@/definitions';
import userService from '@/services/user.service';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'users';

export function useUserListQuery(paginationParam?: PaginationProp<PageFilter>) {
  const fallback: PaginationResponse<User> = {
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
      return userService.getUserList(paginationParam ?? {});
    },
    placeholderData: keepPreviousData,
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

export function usePartnerListQuery(
  paginationParam?: PaginationProp<PageFilter>
) {
  const fallback: PaginationResponse<User> = {
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
    queryKey: [QUERY_KEY + '-partner', Object.values(paginationParam ?? {})],
    queryFn: () => {
      return userService.getPartnerUserList(paginationParam ?? {});
    },
    placeholderData: keepPreviousData,
  });
  return data;
}

export function usePartnerDetailQuery(userId: string) {
  const fallback: User = {} as User;

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY, userId],
    queryFn: () => userService.getPartnerUser(userId),
    enabled: !!userId,
  });

  return data;
}

export function useUpdatePartnerMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.patchPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] });
      toast.success('파트너 정보를 수정하였습니다.');
    },
  });
}

export function useGetCurrentUserQuery() {
  const fallback: User = {} as User;

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY, 'current-user'],
    queryFn: userService.getCurrentUser,
  });

  return data;
}

export function usePatchUserMutation({
  onSuccess,
  onError,
  onSettled,
}: FunctionProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.patchUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, 'user-info'],
      });
      toast.success('정보 수정이 완료 되었습니다.');
      onSuccess && onSuccess();
    },
    onError: () => {
      toast.error('정보 수정이 실패 하였습니다. 잠시 후 다시 시도하여 주세요.');
    },
  });
}
