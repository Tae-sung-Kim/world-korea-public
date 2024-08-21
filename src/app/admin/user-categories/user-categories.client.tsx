'use client';

import {
  useUserCategoryAddMutation,
  useUserCategoryDeleteMutation,
  useUserCategoryQuery,
  useUserCategoryUpdateMutation,
} from '../queries';
import { UserCategoryType } from '@/definitions';
import { useEffect, useState } from 'react';

export default function UserCategoriesClient() {
  const userCategoryList = useUserCategoryQuery();

  const addMutation = useUserCategoryAddMutation();
  const updateMutation = useUserCategoryUpdateMutation();
  const deleteMutation = useUserCategoryDeleteMutation();

  const [list, setList] = useState<UserCategoryType[]>([]);

  useEffect(() => {
    if (userCategoryList) {
      setList([
        ...userCategoryList,
        {
          _id: '',
          name: '',
          level: '1',
        },
      ]);
    }
  }, [userCategoryList]);

  const handleChange =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setList((prevState) =>
        prevState.map((row) => {
          if (row._id !== id) {
            return row;
          }

          let value: string = e.target.value;

          if (e.target.name === 'level') {
            value = value.trim() === '' ? '1' : value;
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
            <button type="button" onClick={() => updateRow(_id)}>
              {isAddField ? '추가하기' : '수정하기'}
            </button>
            {!isAddField && !isFirstRow && (
              <button type="button" onClick={() => deleteRow(_id)}>
                삭제하기
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
