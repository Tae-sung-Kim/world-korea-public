import { UserCategory } from '@/definitions';
import userCategoryService from '@/services/user-category.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'user-categories';

export function useUserCategoryListQuery() {
  const fallback: UserCategory[] = [];

  const { data = fallback } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: userCategoryService.getUserCategoryList,
  });

  return data;
}

export function useAddUserCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userCategoryService.addUserCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('회원 구분을 추가하였습니다.');
    },
  });
}

export function useUpdateUserCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userCategoryService.updateUserCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('회원 구분을 수정하였습니다.');
    },
  });
}

export function useDeleteUserCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userCategoryService.deleteUserCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('회원 구분을 삭제하였습니다.');
    },
  });
}
