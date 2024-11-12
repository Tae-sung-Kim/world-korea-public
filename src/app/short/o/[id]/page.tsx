import { USER_ROLE } from '@/definitions';
import authService from '@/services/auth.service';
import shortService from '@/services/short.service';
import { redirect } from 'next/navigation';

export default async function SaleProductShortUrlPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await authService.getSession();

  if (!session) {
    redirect('/no-session');
  }

  const isAdmin = session.user.role === USER_ROLE.ADMIN;
  const isPartner = session.user.role === USER_ROLE.PARTNER;

  const orderId = await shortService.getOrderIdByShortId(id);
  if (!orderId) {
    throw new Error('Not Found 404');
  }

  if (isAdmin) {
    // 임시로 관리자_판매상품_상세 로 이동
    // TODO...
    // redirect(`/admin/pins/${pinId}`);
  } else if (isPartner) {
    // 파트너사 QR코드 찍는 페이지로 이동?
    // TODO...
    // redirect('/');
  }
}
