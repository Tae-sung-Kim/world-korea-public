import authService from '@/services/auth.service';
import { createShortIdStore } from '@/stores/short-id.store';
import { redirect } from 'next/navigation';

export default async function OrderProductShortUrlPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await authService.getSession();

  const { getState } = createShortIdStore();

  // 로그인하지 않았다면
  if (!session) {
    redirect('/no-session');
  } else {
    getState().setShortId(id);
    redirect('/with-session');
  }
}
