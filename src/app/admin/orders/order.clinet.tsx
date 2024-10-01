'use client';

import { useOrderListQuery } from '../queries';

export default function OrderListClient() {
  const aa = useOrderListQuery();

  console.log(aa);

  return 'aaa';
}
