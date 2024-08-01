'use client';

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PRODUCT_STATUS_MESSAGE } from '@/definitions';
import userCategoryService from '@/services/user-category.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const priceShcema = () => {
  return z.number().refine((d) => Number(d) > 0, {
    message: '0보다 큰 금액을 입력해주세요.',
  });
};

const descriptionShcema = () => {
  return z.string().optional();
};

interface Images {
  id: string;
  file: File | undefined | null;
  blob: Blob | undefined | null;
}

const FormSchema = z.object({
  name: z.string().refine((d) => d.length > 0, {
    message: '상품명을 입력해 주세요.',
  }), // 상품명
  accessLevel: z.string().refine((d) => d.length > 0, {
    message: '레벨을 선택해 주세요.',
  }), // 접근 레벨
  status: z.enum(Object.keys(PRODUCT_STATUS_MESSAGE) as [string, ...string[]], {
    message: '상태를 선택해 주세요.',
  }), // 상품 상태
  images: z.instanceof(File).array(), // 상품 이미지
  regularPrice: priceShcema(), // 정가
  salePrice: priceShcema(), // 할인가
  price: priceShcema(), // 판매가
  description1: descriptionShcema(),
  description2: descriptionShcema(),
  description3: descriptionShcema(),
  description4: descriptionShcema(),
  unavailableDates: z.date().array().optional(), // 이용 불가능 날짜
});

export default function ProductCreateClient() {
  const [fileInputElement, setFileInputElement] = useState<string[]>([
    uuidv4(),
  ]);

  const [images, setImages] = useState<Images[]>([]);

  const { data: userCategoryList } = useQuery({
    queryKey: ['user-categories', 'products'],
    queryFn: userCategoryService.getUserCategoryList,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '', // 상품명
      accessLevel: '', // 접근 레벨
      status: '', // 상품 상태
      images: [], // 상품 이미지
      regularPrice: 0, // 정가
      salePrice: 0, // 할인가
      price: 0, // 판매가
      description1: '',
      description2: '',
      description3: '',
      description4: '',
      unavailableDates: [new Date()], // 이용 불가능 날짜
    },
  });

  //상품 등록
  const handleSubmit = () => {
    // const formData = form.getValues();
    // // form.setValue('images', [form])
    // console.log(formData);

    const formData = new FormData();
  };

  const removeComma = (value: string) => {
    return Number(value.replace(/,/g, ''));
  };

  //가격 입력
  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    if (!isNaN(removeComma(e.target.value))) {
      field.onChange(removeComma(e.target.value));
    }
  };

  //이미지 추가 버튼
  const handleAddImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFileInputElement((prevInput) => [...prevInput, uuidv4()]);
  };

  //이미지 삭제 버튼
  const handleDeleteImage = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();

    //인풋 삭제
    setFileInputElement((prevInput) => prevInput.filter((fId) => fId !== id));

    //파일 삭제
    setImages((prevImage) => prevImage.filter((f) => f.id !== id));
  };

  const handleInputFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, id: string) => {
      e.preventDefault();

      const copyImages = [...images];

      if (copyImages.find((f) => f.id === id)) {
        //있을 경우 -> 교체
      } else {
        //없을 경우 추가
      }
    },
    [images]
  );

  console.log(images, fileInputElement);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상품명</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="상품명을 입력해 주세요."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accessLevel"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {userCategoryList?.map((d) => {
                          return (
                            <SelectItem key={d._id} value={String(d.level)}>
                              {d.name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상태</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(PRODUCT_STATUS_MESSAGE).map(
                        ([key, value]) => {
                          return (
                            <SelectItem key={key} value={String(key)}>
                              {value}
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 이미지 추가하기 */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>이미지</FormLabel>
                <Button
                  className="size-5"
                  onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    handleAddImage(e)
                  }
                >
                  +
                </Button>
              </div>

              {fileInputElement.map((id) => {
                return (
                  <div key={id} className="flex space-x-4">
                    <FormControl>
                      <Input
                        className="flex-initial"
                        type="file"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputFileChange(e, id)
                        }
                      />
                    </FormControl>
                    <Button
                      onClick={(e: MouseEvent<HTMLButtonElement>) =>
                        handleDeleteImage(e, id)
                      }
                    >
                      -
                    </Button>
                  </div>
                );
              })}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="regularPrice"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>정가</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="정가를 입력해 주세요."
                    value={field.value.toLocaleString('ko-KR')}
                    onChange={(e) => handlePriceChange(e, { ...field })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="salePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>할인 가격</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="할인 가격을 입력해 주세요."
                  value={field.value.toLocaleString('ko-KR')}
                  onChange={(e) => handlePriceChange(e, { ...field })}
                />
                {/* 할인율 */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>판매가</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="판매가를 입력해 주세요."
                  value={field.value.toLocaleString('ko-KR')}
                  onChange={(e) => handlePriceChange(e, { ...field })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>추가 정보1</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="추가 정보를 입력해주세요."
                  {...field}
                ></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>추가 정보2</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="추가 정보를 입력해주세요."
                  {...field}
                ></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>추가 정보3</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="추가 정보를 입력해주세요."
                  {...field}
                ></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description4"
          render={({ field }) => (
            <FormItem>
              <FormLabel>추가 정보4</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="추가 정보를 입력해주세요."
                  {...field}
                ></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unavailableDates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이용 불가 날짜</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="날짜를 선택해주세요."
                  onChange={() => {
                    console.log('11');
                  }}
                  value={[]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center pt-4">
          <Button type="submit">상품 등록</Button>
        </div>
      </form>
    </Form>
  );
}
