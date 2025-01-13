'use client';

import { useAuthContext } from '@/contexts/auth.context';
import shortService from '@/services/short.service';
import userService from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WithSessionClient({
  shortId,
}: {
  shortId: string | null;
}) {
  const { isLoggedIn } = useAuthContext();

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    (async () => {
      const { isPartner } = await userService.getCurrentUser();
      if (isPartner) {
        // pin 사용 page로 이동
        router.replace('/partner/pins/used');
      } else {
        //전체 상품이 옴
        const saleProduct = await shortService.getSaleProductIdByShortId(
          String(shortId)
        );
        router.replace(`/admin/sale-products/${saleProduct}`);
      }
    })();
  }, [router, isLoggedIn, shortId]);

  return <></>;
}
