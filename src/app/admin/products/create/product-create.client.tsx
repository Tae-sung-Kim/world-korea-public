'use client';

import { descriptionShcema, priceShcema } from '../product.schema';
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
import Image from 'next/image';
import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';

type ProductImage = {
  file: File | undefined;
  blob: string | undefined;
};

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
  const [productImages, setProductImages] = useState<ProductImage[]>([
    {
      file: undefined,
      blob: undefined,
    },
  ]);

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
      regularPrice: '0', // 정가
      salePrice: '0', // 할인가
      price: '0', // 판매가
      description1: '',
      description2: '',
      description3: '',
      description4: '',
      unavailableDates: [new Date()], // 이용 불가능 날짜
    },
  });

  //상품 등록
  const handleSubmit = () => {
    const formValues = form.getValues() as { [key: string]: any };
    const formData = new FormData();

    for (let key in formValues) {
      if (key === 'images') {
        productImages.forEach((data) => {
          if (data.file instanceof File && data.file.size > 0) {
            formData.append(key, data.file);
          }
        });
      } else {
        formData.append(key, formValues[key]);
      }
    }
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
  const handleAddImage = () => {
    setProductImages((prevImage) => [
      ...prevImage,
      {
        file: undefined,
        blob: undefined,
      },
    ]);
  };

  //이미지 삭제 버튼
  const handleDeleteImage = (idx: number) => {
    //파일 삭제
    setProductImages((prevImage) =>
      prevImage.filter((_, fIdx) => fIdx !== idx)
    );
  };

  const handleInputFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, idx: number) => {
      e.preventDefault();
      const file = e.target.files?.item(0);

      if (file) {
        //blob으로 변경
        const blobFile = new Blob([file], { type: file.type });
        const blob = URL.createObjectURL(blobFile);

        setProductImages((prevImages) =>
          prevImages.map((d, dIdx) => {
            if (dIdx === idx) {
              return {
                file,
                blob,
              };
            } else return d;
          })
        );
      }
    },
    []
  );

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
                  type="button"
                  onClick={() => handleAddImage()}
                >
                  +
                </Button>
              </div>

              {productImages.map(({ blob }, idx) => {
                return (
                  <div key={'proudct-image-' + idx} className="flex space-x-4">
                    <FormControl>
                      <Input
                        className="flex-initial"
                        type="file"
                        accept="image/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputFileChange(e, idx)
                        }
                      />
                    </FormControl>
                    {blob && (
                      <Image
                        src={blob}
                        width={250}
                        height={250}
                        alt="등록 이미지"
                      />
                    )}
                    <Button
                      type="button"
                      onClick={() => handleDeleteImage(idx)}
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
                    value={Number(field.value).toLocaleString('ko-KR')}
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
                  value={Number(field.value).toLocaleString('ko-KR')}
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
                  value={Number(field.value).toLocaleString('ko-KR')}
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
