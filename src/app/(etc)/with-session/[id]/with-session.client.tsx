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

  return <></>;
}
