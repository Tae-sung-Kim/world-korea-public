'use client';

import userCategoryService from '@/services/user-category.service';
import { UserCategoryType } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UserCategoriesClient() {
  const queryClient = useQueryClient();
  const { data, isPending, isFetching } = useQuery({
    queryKey: ['user-categories'],
    queryFn: userCategoryService.getUserCategoryList,
  });
  const addMutation = useMutation({
    mutationFn: userCategoryService.addUserCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-categories'] });
      toast.success('회원 구분을 추가하였습니다.');
    },
  });
  const updateMutation = useMutation({
    mutationFn: userCategoryService.updateUserCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-categories'] });
      toast.success('회원 구분을 수정하였습니다.');
    },
  });
  const deleteMutation = useMutation({
    mutationFn: userCategoryService.deleteUserCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-categories'] });
      toast.success('회원 구분을 삭제하였습니다.');
    },
  });

  const [list, setList] = useState<UserCategoryType[]>([]);

  useEffect(() => {
    if (data) {
      setList([
        ...data,
        {
          _id: '',
          name: '',
          level: 1,
        },
      ]);
    }
  }, [data]);

  const handleChange =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setList((prevState) =>
        prevState.map((row) => {
          if (row._id !== id) {
            return row;
          }

          let value: string | number = e.target.value;

          if (e.target.name === 'level') {
            value = value.trim() === '' ? 0 : Number(value);
          }

          return {
            ...row,
            [e.target.name]: value,
          };
        })
      );
    };

  const updateRow = (id: string) => {
    const data = list.find((d) => d._id === id);
    if (!data) {
      return false;
    }

    if (id) {
      // 수정하기
      updateMutation.mutate(data);
    } else {
      // 추가하기
      addMutation.mutate(data);
    }
  };

  const deleteRow = (id: string) => {
    const data = list.find((d) => d._id === id);
    if (!data) {
      return false;
    }

    deleteMutation.mutate(data._id);
  };

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="container">
      {list.map((item, index) => {
        const { _id, name, level } = item;
        const isFirstRow = index === 0;
        const isAddField = !_id;

        return (
          <div key={_id}>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange(_id)}
            />
            <input
              type="number"
              name="level"
              value={level}
              onChange={handleChange(_id)}
            />
            <button
              type="button"
              disabled={isFetching}
              onClick={() => updateRow(_id)}
            >
              {isAddField ? '추가하기' : '수정하기'}
            </button>
            {!isAddField && !isFirstRow && (
              <button
                type="button"
                disabled={isFetching}
                onClick={() => deleteRow(_id)}
              >
                삭제하기
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
