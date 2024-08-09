'use client';

import ProductList from './product-list';
import productService from '@/services/product.service';
import userCategoryService from '@/services/user-category.service';
import { useQuery } from '@tanstack/react-query';

export default function ProductListClient() {
  const { data: productList = [], isFetching } = useQuery({
    queryKey: ['getProudctList'],
    queryFn: productService.getProudctList,
  });

  //유저 레벨
  const { data: userCategoryList } = useQuery({
    queryKey: ['user-categories', 'products'],
    queryFn: userCategoryService.getUserCategoryList,
  });

  return (
    <ProductList
      productList={productList}
      userCategoryList={userCategoryList}
    />
  );
}
