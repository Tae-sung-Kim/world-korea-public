'use client';

import {
  useAddUserCategoryMutation,
  useDeleteUserCategoryMutation,
  useUpdateUserCategoryMutation,
  useUserCategoryListQuery,
} from '../queries';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
      name: z.string().refine((d) => d.length > 0, {
        message: '회원등급명을 입력해 주세요.',
      }),
      level: z
        .string()
        .or(z.number())
        .refine((d) => Number(d) > 0, {
          message: '레벨을 입력해 주세요.',
        }),
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
    <div className="h-full flex flex-col max-w-[1920px] mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex items-center gap-2 bg-white hover:bg-gray-50"
          onClick={handleRowAdd}
        >
          <FaPlus className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            새 등급 추가
          </span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden bg-white hover:bg-gray-50"
          onClick={handleRowAdd}
        >
          <FaPlus className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-full">
          <div className="overflow-auto pt-8">
            <Form {...userCategoriesForm}>
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[70px]">
                      번호
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      회원등급명
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[80px] text-center">
                      level
                    </TableHead>
                    <TableHead className="h-12 text-sm font-semibold text-gray-900 whitespace-nowrap w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryList.fields.map(
                    (d: FieldUserCategory, idx: number) => (
                      <TableRow
                        key={d.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="p-4 text-sm text-gray-700">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="p-4">
                          <Controller
                            name={`categories.${idx}.name`}
                            control={userCategoriesForm.control}
                            render={({ field, fieldState }) => (
                              <div className="space-y-2">
                                <Input
                                  {...field}
                                  type="text"
                                  className="max-w-[300px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="회원등급명을 입력해 주세요."
                                />
                                {fieldState.error && (
                                  <span className="text-red-500 text-xs block">
                                    {fieldState.error.message}
                                  </span>
                                )}
                              </div>
                            )}
                          />
                        </TableCell>
                        <TableCell className="p-4">
                          <Controller
                            name={`categories.${idx}.level`}
                            control={userCategoriesForm.control}
                            render={({ field, fieldState }) => (
                              <div className="space-y-2">
                                <Input
                                  {...field}
                                  type="text"
                                  className="w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="레벨"
                                />
                                {fieldState.error && (
                                  <span className="text-red-500 text-xs block">
                                    {fieldState.error.message}
                                  </span>
                                )}
                              </div>
                            )}
                          />
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex justify-end space-x-2">
                            {d._id ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-gray-100"
                                  onClick={() => {
                                    userCategoriesForm.handleSubmit(() => {
                                      handleUserCategoryUpdate(d._id ?? '');
                                    })();
                                  }}
                                >
                                  <BsPencilSquare className="h-4 w-4 text-gray-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-red-100"
                                  onClick={() =>
                                    handleUserCategoryDelete({
                                      id: d._id ?? '',
                                      idx,
                                    })
                                  }
                                >
                                  <RiDeleteBinFill className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-green-100"
                                  type="button"
                                  onClick={async () => {
                                    const isValid =
                                      await userCategoriesForm.trigger([
                                        `categories.${idx}.name`,
                                        `categories.${idx}.level`,
                                      ]);
                                    if (isValid) {
                                      handleUserCategoryAdded(idx);
                                    }
                                  }}
                                >
                                  <AiOutlineUserAdd className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-red-100"
                                  onClick={() =>
                                    handleUserCategoryDelete({
                                      id: d._id ?? '',
                                      idx,
                                    })
                                  }
                                >
                                  <RiDeleteBinFill className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </Form>
          </div>
        </div>
        <div className="mt-auto sticky bottom-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1)]">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-900">
                  총 회원등급
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-primary">
                  {categoryList.fields.length}
                </span>
                <span className="text-sm font-medium text-gray-600">개</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
