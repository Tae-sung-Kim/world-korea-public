'use client';

import { useGetCurentUserQuery } from '@/app/admin/queries';
import shortService from '@/services/short.service';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function WithSessionClient({
  shortId,
}: {
  shortId: string | null;
}) {
  const currentUser = useGetCurentUserQuery();

  useEffect(() => {
    if (Object.keys(currentUser).length < 1) {
      return;
    }

    const { isPartner } = currentUser;
    if (isPartner) {
      // pin 사용 page로 이동
      redirect('/partner/pins/used');
    } else {
      (async () => {
        const stringShortId = shortId ?? '';
        const orderId = await shortService.getOrderIdByShortId(stringShortId);
        alert('orderId' + orderId);
        // redirect(`/admin/sale-products/${orderId}`);
      })();
    }
  }, [currentUser, shortId]);

  // const orderId = await shortService.getOrderIdByShortId(id);
  // if (!orderId) {
  //   throw new Error('Not Found 404');
  // }

  // if (isAdmin) {
  //   // 임시로 관리자_판매상품_상세 로 이동
  //   // TODO...
  //   // redirect(`/admin/pins/${pinId}`);
  // } else if (isPartner) {
  //   // 파트너사 QR코드 찍는 페이지로 이동?
  //   // TODO...
  //   // redirect('/');
  // }

  return <></>;
}
