'use client';

import { descriptionShcema, priceShcema } from './product.schema';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_MESSAGE,
  ProductFormData,
  UserCategoryType,
} from '@/definitions';
import productService from '@/services/product.service';
import { bytesToMB, fileToBlob } from '@/utils/file';
import { addComma, removeComma } from '@/utils/number';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import {
  useForm,
  useFieldArray,
  Controller,
  ControllerRenderProps,
} from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const ProductFormSchema = z.object({
  name: z.string().refine((d) => d.length > 0, {
    message: '상품명을 입력해 주세요.',
  }), // 상품명
  accessLevel: z.string().refine((d) => d.length > 0, {
    message: '레벨을 선택해 주세요.',
  }), // 접근 레벨
  status: z.enum(
    [
      PRODUCT_STATUS.AVAILABLE,
      PRODUCT_STATUS.HIDDEN,
      PRODUCT_STATUS.OUT_OF_STOCK,
    ],
    {
      message: '상태를 선택해 주세요.',
    }
  ), // 상품 상태
  images: z.array(
    z.object({
      file: z
        .instanceof(File)
        .optional()
        .refine((d) => d, {
          message: '파일을 등록해 주세요.',
        }),
    })
  ), // 상품 이미지
  regularPrice: priceShcema(), // 정가
  salePrice: priceShcema(), // 할인가
  price: priceShcema(), // 판매가
  description1: descriptionShcema(),
  description2: descriptionShcema(),
  description3: descriptionShcema(),
  description4: descriptionShcema(),
  // unavailableDates: z.string().array().optional(), // 이용 불가능 날짜
});

type ProductFormValues = z.infer<typeof ProductFormSchema>;
type ProductImage = {
  name: string;
  size: string;
  blob: string;
};

type Props = {
  userCategoryList: UserCategoryType[] | undefined;
  productDetail: ProductFormData | undefined;
};

export default function ProductForm({
  userCategoryList,
  productDetail,
}: Props) {
  console.log('productDetail', productDetail);

  const [productImageBlobList, setProductImageBlobList] = useState<
    ProductImage[]
  >([]);

  const ProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      handleResetForm();
      toast.success('상품이 등록 되었습니다.');
    },
  });

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '', // 상품명
      accessLevel: '1', // 접근 레벨
      status: PRODUCT_STATUS.AVAILABLE, // 상품 상태
      images: [{ file: undefined }], // 상품 이미지
      regularPrice: '0', // 정가
      salePrice: '0', // 할인가
      price: '0', // 판매가
      description1: '',
      description2: '',
      description3: '',
      description4: '',
      // unavailableDates: [], // 이용 불가능 날짜
    },
  });

  //fields, append, remove, update??
  const productImages = useFieldArray({
    control: productForm.control,
    name: 'images',
    rules: {
      required: true,
    },
  });

  const handleSubmit = () => {
    const data = new FormData();

    const formValues = productForm.getValues();

    for (const [key, values] of Object.entries(formValues)) {
      if (Array.isArray(values)) {
        values.forEach((value) => {
          const file = value.file;
          if (file instanceof File) {
            data.append('images', file);
          }
        });
      } else {
        data.append(key, values);
      }
    }
    ProductMutation.mutate(data);
  };

  const handleAddImage = () => {
    productImages.append({ file: undefined });
  };

  //상품 등록 후 reset
  const handleResetForm = () => {
    setProductImageBlobList([]);
    productForm.reset();
  };

  const handleInputFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    e.preventDefault();
    const file = e.target.files?.item(0);

    if (file) {
      fileToBlob({
        file,
        handler: ({ blob }: { blob: string }) => {
          setProductImageBlobList((prevBlob) => [
            ...prevBlob,
            {
              name: file.name,
              size: String(bytesToMB(file.size)),
              blob,
            },
          ]);
          field.onChange(file);
        },
      });
    }
  };

  //이미지 삭제 버튼
  const handleDeleteImage = (idx: number) => {
    productImages.remove(idx);
    setProductImageBlobList((prevBlob) =>
      prevBlob.filter((_, dIdx) => dIdx !== idx)
    );
  };

  //가격 입력
  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    if (!isNaN(removeComma(e.target.value))) {
      field.onChange(String(removeComma(e.target.value)));
    }
  };

  return (
    <Form {...productForm}>
      <Button type="button" onClick={handleResetForm}>
        reset
      </Button>

      <form
        onSubmit={productForm.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <FormField
          control={productForm.control}
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
          control={productForm.control}
          name="accessLevel"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
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
          control={productForm.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상태</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
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

        <div>
          <Label>이미지</Label>
          <Button
            className="size-5"
            type="button"
            onClick={() => handleAddImage()}
          >
            +
          </Button>
        </div>

        {productImages.fields.map((d, idx) => {
          const blobImages = productImageBlobList[idx];
          return (
            <div className="flex space-x-4" key={d.id}>
              {blobImages ? (
                <div>
                  <div>파일명 : {blobImages.name}</div>
                  <div>용량 : {blobImages.size} MB</div>
                  <Image
                    src={blobImages.blob}
                    width={250}
                    height={250}
                    alt="등록 이미지"
                  />
                </div>
              ) : (
                <>
                  <Controller
                    name={`images.${idx}.file`}
                    control={productForm.control}
                    render={({ field }) => {
                      return (
                        <Input
                          className="flex-initial"
                          type="file"
                          accept="image/*"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleInputFileChange(e, { ...field })
                          }
                        />
                      );
                    }}
                  />
                  {productForm.formState.errors.images?.[idx]?.file && (
                    <span className="text-red-500 text-sm">
                      {productForm.formState.errors.images[idx].file.message}
                    </span>
                  )}
                </>
              )}
              <Button type="button" onClick={() => handleDeleteImage(idx)}>
                -
              </Button>
            </div>
          );
        })}

        <FormField
          control={productForm.control}
          name="regularPrice"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>정가</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="정가를 입력해 주세요."
                    value={addComma(Number(field.value))}
                    onChange={(e) => handlePriceChange(e, { ...field })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={productForm.control}
          name="salePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>할인 가격</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="할인 가격을 입력해 주세요."
                  value={addComma(Number(field.value))}
                  onChange={(e) => handlePriceChange(e, { ...field })}
                />
                {/* 할인율 */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={productForm.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>판매가</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="판매가를 입력해 주세요."
                  value={addComma(Number(field.value))}
                  onChange={(e) => handlePriceChange(e, { ...field })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={productForm.control}
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
          control={productForm.control}
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
          control={productForm.control}
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
          control={productForm.control}
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

        <div className="flex justify-center pt-4">
          <Button type="submit">상품 등록</Button>
        </div>
      </form>
    </Form>
  );
}
