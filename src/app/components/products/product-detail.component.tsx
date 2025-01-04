'use client';

import FileSelect from '../common/file-select.component';
import {
  descriptionShcema,
  priceShcema,
} from '@/app/admin/products/product.schema';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUserCategoryListQuery,
} from '@/app/admin/queries';
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
import { MODAL_TYPE, useModalContext } from '@/contexts/modal.context';
import { PRODUCT_STATUS, PRODUCT_STATUS_MESSAGE } from '@/definitions';
import productService from '@/services/product.service';
import { bytesToMB, fileToBlob } from '@/utils/file';
import { addComma, removeComma } from '@/utils/number';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import {
  useForm,
  useFieldArray,
  Controller,
  ControllerRenderProps,
} from 'react-hook-form';
import { FaMinus, FaPlus } from 'react-icons/fa';
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
    z
      .object({
        file: z
          .instanceof(File)
          .optional()
          .refine((d) => d, {
            message: '파일을 등록해 주세요.',
          }),
      })
      .or(z.string())
  ), // 상품 이미지
  regularPrice: priceShcema(), // 정가
  // taxFreeRegularPrice: priceShcema(), // 면세 정가
  salePrice: priceShcema(), // 할인가
  price: priceShcema(true), // 판매가
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
  productId?: string;
  disabled?: boolean;
};

export default function ProductDetail({ productId, disabled = false }: Props) {
  const { openModal } = useModalContext();

  const userCategoryList = useUserCategoryListQuery();

  const [productImageList, setProductImageList] = useState<ProductImage[]>([]);

  //상품 등록 후 reset
  const handleResetForm = () => {
    setProductImageList([]);
    productForm.reset();
  };

  //상품 추가
  const createProductMutation = useCreateProductMutation({
    onSuccess: handleResetForm,
  });

  //상품 수정
  const updateProductMutation = useUpdateProductMutation({});

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: !!productId
      ? async () =>
          productService.detailProudct(productId).then((res) => {
            let images = res.images.map((d) => ({
              name: '',
              size: '',
              blob: d as string,
            }));

            setProductImageList(images);

            return {
              ...res,
              price: addComma(res.price),
              regularPrice: addComma(res.regularPrice),
              salePrice: addComma(res.salePrice),
              // taxFreeRegularPrice: addComma(res.taxFreeRegularPrice), // 작업해야 함
            };
          })
      : {
          name: '', // 상품명
          accessLevel: '1', // 접근 레벨
          status: PRODUCT_STATUS.AVAILABLE, // 상품 상태
          images: [{ file: undefined }], // 상품 이미지
          regularPrice: '0', // 정가
          // taxFreeRegularPrice: '0', // 면세 정가
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
  });

  const handleSubmit = () => {
    const data = new FormData();

    const formValues = productForm.getValues();

    for (const [key, values] of Object.entries(formValues)) {
      if (Array.isArray(values)) {
        values.forEach((value) => {
          if (typeof value === 'string') {
            data.append(key, value);
          } else {
            const file = value.file;
            if (file instanceof File) {
              data.append('images', file);
            }
          }
        });
      } else {
        if (
          [
            'price',
            'regularPrice',
            'salePrice',
            'taxFreeRegularPrice',
          ].includes(key)
        ) {
          data.append(key, String(removeComma(values)));
        } else {
          data.append(key, values);
        }
      }
    }

    if (productId) {
      updateProductMutation.mutate({ id: productId, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleAddImage = () => {
    productImages.append({ file: undefined });
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
          setProductImageList((prevBlob) => [
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
    if (productImages.fields.length <= 1) {
      openModal({
        type: MODAL_TYPE.ALERT,
        showHeader: false,
        content: '상품 이미지는 최소 1개 이상입니다.',
        useCancelButton: false,
      });
      return;
    }

    productImages.remove(idx);
    setProductImageList((prevBlob) =>
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
      <form
        onSubmit={productForm.handleSubmit(handleSubmit)}
        className="max-w-5xl mx-auto p-8 space-y-8 bg-white rounded-xl shadow-sm"
      >
        {!disabled && (
          <div className="space-y-6">
            <FormField
              control={productForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-800">
                    상품명
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="상품명을 입력해 주세요"
                      value={field.value ?? ''}
                      disabled={disabled}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={productForm.control}
                name="accessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-800">
                      Level
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="레벨을 선택해 주세요" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            {userCategoryList?.map((d) => (
                              <SelectItem
                                key={d._id}
                                value={String(d.level)}
                                className="hover:bg-gray-50"
                              >
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={productForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-800">
                      상태
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="상태를 선택해 주세요" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            {Object.entries(PRODUCT_STATUS_MESSAGE).map(
                              ([key, value]) => (
                                <SelectItem
                                  key={key}
                                  value={String(key)}
                                  className="hover:bg-gray-50"
                                >
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-800">
                상품 이미지
              </h3>
              {!disabled && (
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => handleAddImage()}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <FaPlus className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productImages.fields.map((d, idx) => {
              const blobImages = productImageList[idx];

              return (
                <div key={d.id} className="relative group">
                  {blobImages ? (
                    <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="space-y-1.5">
                          {!!blobImages.name && (
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">파일명:</span>
                              <span className="ml-1 break-all">
                                {blobImages.name}
                              </span>
                            </div>
                          )}
                          {!!blobImages.size && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">용량:</span>
                              <span className="ml-1">{blobImages.size} MB</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="relative aspect-square bg-gray-50">
                        <Image
                          src={blobImages.blob}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                          alt="등록 이미지"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Controller
                        name={`images.${idx}.file`}
                        control={productForm.control}
                        render={({ field, fieldState }) => (
                          <div className="space-y-3">
                            <FileSelect
                              onInputFileChange={(
                                e: ChangeEvent<HTMLInputElement>
                              ) => handleInputFileChange(e, { ...field })}
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-500 text-center">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  )}
                  {!disabled && (
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => handleDeleteImage(idx)}
                      className="absolute -top-2 -right-2 z-10 w-7 h-7 p-0 rounded-full bg-white hover:bg-red-50 border shadow-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                      <FaMinus className="w-3 h-3 text-red-500" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!disabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={productForm.control}
              name="regularPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-800">
                    정가
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="정가를 입력해 주세요"
                      value={addComma(field.value)}
                      disabled={disabled}
                      onChange={(e) => handlePriceChange(e, { ...field })}
                      className="w-full p-3 text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={productForm.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-800">
                    할인가
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="할인가를 입력해 주세요"
                      value={addComma(field.value)}
                      disabled={disabled}
                      onChange={(e) => handlePriceChange(e, { ...field })}
                      className="w-full p-3 text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={productForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-800">
                    판매가
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="판매가를 입력해 주세요"
                      value={addComma(field.value)}
                      disabled={disabled}
                      onChange={(e) => handlePriceChange(e, { ...field })}
                      className="w-full p-3 text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="space-y-6">
          {[1, 2, 3, 4].map((num) => (
            <FormField
              key={num}
              control={productForm.control}
              name={`description${num}` as keyof ProductFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-800">
                    추가 정보 {num}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={disabled}
                      value={typeof field.value === 'string' ? field.value : ''}
                      placeholder={`추가 정보를 입력해주세요`}
                      className="min-h-[100px] w-full resize-none p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />
          ))}
        </div>

        {!disabled && (
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              variant="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {productId ? '수정' : '등록'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
