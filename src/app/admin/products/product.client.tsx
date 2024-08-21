'use client';

import { useProductListQuery, useUserCategoryListQuery } from '../queries';
import Product from './product';

export default function ProductListClient() {
  const productList = useProductListQuery();

  //유저 레벨
  const userCategoryList = useUserCategoryListQuery();

  return (
    <Product productList={productList} userCategoryList={userCategoryList} />
  );
}
