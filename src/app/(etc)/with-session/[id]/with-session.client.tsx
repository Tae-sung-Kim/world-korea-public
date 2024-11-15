'use client';

import { useGetCurentUserQuery } from '@/app/admin/queries';
import { useAuthContext } from '@/contexts/auth.context';
import shortService from '@/services/short.service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WithSessionClient({
  shortId,
}: {
  shortId: string | null;
}) {
  const { isLoggedIn } = useAuthContext();

  const currentUser = useGetCurentUserQuery();

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    (async () => {
      const { isPartner } = currentUser;
      if (isPartner) {
        // pin 사용 page로 이동
        router.replace('/partner/pins/used');
      } else {
        //전체 상품이 옴
        const { saleProduct } = await shortService.getOrderIdByShortId(
          String(shortId)
        );
        router.replace(`/admin/sale-products/${saleProduct}`);
      }
    })();
  }, [router, isLoggedIn, currentUser, shortId]);

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
