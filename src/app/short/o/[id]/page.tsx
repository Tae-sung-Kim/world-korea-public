import authService from '@/services/auth.service';
import shortService from '@/services/short.service';
import { redirect } from 'next/navigation';

export default async function OrderProductShortUrlPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await authService.getSession();
  // 로그인하지 않았다면
  if (!session) {
    redirect('/no-session');
  } else {
    redirect('/with-session?id=' + id);
  }
}
