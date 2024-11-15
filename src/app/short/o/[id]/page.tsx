import authService from '@/services/auth.service';
import { createShortIdStore } from '@/stores/short-id.store';
import { redirect } from 'next/navigation';

export default async function OrderProductShortUrlPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await authService.getSession();

  /**
  이거는 현재 브라우저에서만 해당될거 같고,
  qr을 찍었을때는 모바일 브라우저에는 저게 없기때문에
  최초에 값을 가져오지 못함
  따라서, queryString으로 전달 해야 할거 같음
   */

  const { getState } = createShortIdStore();

  // 로그인하지 않았다면
  if (!session) {
    redirect('/no-session');
  } else {
    getState().setShortId(id);
    redirect(`/with-session/${id}`);
  }
}
