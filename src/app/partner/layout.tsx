import PartnerProtectedRoute from './partner-protected-route.component';
import Loading from '@/app/components/loading.component';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/layout/Layout';
import Link from 'next/link';
import { BiPurchaseTag } from 'react-icons/bi';
import { TiSortNumericallyOutline } from 'react-icons/ti';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <PartnerProtectedRoute>
        <Loading />
        <div className="container flex py-12 gap-6">
          <div className="w-[260px] border border-gray-200 bg-white">
            <div className="flex items-center justify-center py-4 text-white bg-black">
              <h2 className="text-2xl">파트너 페이지</h2>
            </div>
            <ul>
              <li className="p-5 my-4">
                <span className="flex items-center gap-1 text-xl font-bold">
                  구매 관리
                  <BiPurchaseTag />
                </span>
                <ul className="mt-2">
                  <li className="text-sm mt-[2px] text-gray-600">
                    <Link href="/partner/orders">구매 목록</Link>
                  </li>
                </ul>
              </li>
              <Separator />
              <li className="p-5 my-4">
                <span className="flex text-lg font-bold">
                  핀번호 관리
                  <TiSortNumericallyOutline />
                </span>
                <ul className="mt-2">
                  <li className="text-sm mt-[2px] text-gray-600">
                    <Link href="/partner/pins">핀번호 목록</Link>
                  </li>
                  <li className="text-sm mt-[2px] text-gray-600">
                    <Link href="/partner/pins/used">핀번호 사용</Link>
                  </li>
                </ul>
              </li>
              <Separator />
            </ul>
          </div>
          <div className="flex-grow bg-white p-6">{children}</div>
        </div>
      </PartnerProtectedRoute>
    </Layout>
  );
}
