'use client';

import {
  useAddUserCategoryMutation,
  useDeleteUserCategoryMutation,
  useUpdateUserCategoryMutation,
  useUserCategoryListQuery,
} from '../queries';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserCategory } from '@/definitions';
import { addComma } from '@/utils/number';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BsPencilSquare } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import { RiDeleteBinFill } from 'react-icons/ri';
import { z } from 'zod';

type FieldUserCategory = Partial<UserCategory & { id: string }>;

const UserCategoriesFormSchema = z.object({
  categories: z.array(
    z.object({
      _id: z.string().optional(),
      id: z.string().optional(),
      name: z.string(),
      level: z.string().or(z.number()),
    })
  ),
});
type UserCategoriesFormValues = z.infer<typeof UserCategoriesFormSchema>;

export default function UserCategoriesClient() {
  const userCategoryList = useUserCategoryListQuery();

  const addMutation = useAddUserCategoryMutation();
  const updateMutation = useUpdateUserCategoryMutation();
  const deleteMutation = useDeleteUserCategoryMutation();

  const userCategoriesForm = useForm<UserCategoriesFormValues>({
    resolver: zodResolver(UserCategoriesFormSchema),
    defaultValues: {
      categories: userCategoryList,
    },
  });

  const categoryList = useFieldArray({
    control: userCategoriesForm.control,
    name: 'categories',
  });

  const findGetValues = (id: string | number) => {
    const getValuesData = Object.values(userCategoriesForm.getValues()).flat();

    if (typeof id === 'string') {
      return getValuesData.find((value) => value._id === id);
    } else {
      return getValuesData[id];
    }
  };

  const handleUserCategoryUpdate = (id: string) => {
    const foundValue = findGetValues(id);
    if (foundValue) {
      const { _id, name, level } = foundValue;
      if (_id) {
        updateMutation.mutate({
          _id,
          name,
          level,
        });
      }
    }
  };
  const handleUserCategoryAdded = (idx: number) => {
    const foundValue = findGetValues(idx);

    if (foundValue) {
      const { _id = '', name, level } = foundValue;
      addMutation.mutate({ _id, name, level: Number(level) });
    }
  };

  const handleRowAdd = () => {
    categoryList.append({ name: '', level: '' });
  };

  const handleUserCategoryDelete = ({
    id,
    idx,
  }: {
    id?: string;
    idx?: number;
  }) => {
    //id가 있다면 삭제 처리
    if (id) {
      deleteMutation.mutate(id);
    }

    //없으면 idx만 삭제
    if (idx && idx > -1) {
      categoryList.remove(idx);
    }
  };

  useEffect(() => {
    if (Array.isArray(userCategoryList) && userCategoryList.length > 0) {
      userCategoriesForm.reset({ categories: userCategoryList });
    }
  }, [userCategoriesForm, userCategoryList]);

  return (
    <Form {...userCategoriesForm}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">번호</TableHead>
            <TableHead className="text-center">회원등급명</TableHead>
            <TableHead className="w-[80px]">level</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {categoryList.fields.map((d: FieldUserCategory, idx: number) => {
              return (
                <TableRow key={d.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <Controller
                      name={`categories.${idx}.name`}
                      control={userCategoriesForm.control}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            type="text"
                            placeholder="회원등급명을 입력해 주세요."
                          />
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`categories.${idx}.level`}
                      control={userCategoriesForm.control}
                      render={({ field }) => {
                        return (
                          <Input {...field} type="text" placeholder="레벨" />
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      {d._id ? (
                        <>
                          <Button
                            onClick={() =>
                              handleUserCategoryUpdate(d._id ?? '')
                            }
                          >
                            <BsPencilSquare />
                          </Button>
                          <Button
                            onClick={() =>
                              handleUserCategoryDelete({ id: d._id ?? '', idx })
                            }
                          >
                            <RiDeleteBinFill />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button onClick={() => handleUserCategoryAdded(idx)}>
                            <AiOutlineUserAdd />
                          </Button>
                          <Button
                            onClick={() =>
                              handleUserCategoryDelete({ id: d._id ?? '', idx })
                            }
                          >
                            <RiDeleteBinFill />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </>
        </TableBody>
      </Table>
      <Button type="button" onClick={handleRowAdd}>
        <FaPlus />
      </Button>
    </Form>
  );
}
