import AdminProtectedRoute from '@/app/admin/admin-protected-route.component';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { TbTicket, TbUser } from 'react-icons/tb';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminProtectedRoute>
      <div className="container flex py-12 gap-6">
        <div className="w-[260px] border border-gray-200 bg-white">
          <div className="flex items-center justify-center py-4 text-white bg-black">
            <h2 className="text-2xl">관리자 페이지</h2>
          </div>
          <ul>
            <li className="p-5 my-4">
              <span className="flex items-center gap-1 text-xl font-bold">
                상품 관리
                <TbTicket />
              </span>
              <ul className="mt-2">
                <li className="text-sm mt-[2px] text-gray-600">상품 목록</li>
                <li className="text-sm mt-[2px] text-gray-600">상품 등록</li>
              </ul>
            </li>
            <Separator />
            <li className="p-5 my-4">
              <span className="flex items-center gap-1 text-xl font-bold">
                회원 관리
                <TbUser />
              </span>
              <ul className="mt-2">
                <li className="text-sm mt-[2px] text-gray-600">
                  <Link href="/admin/user-categories">회원 구분</Link>
                </li>
                <li className="text-sm mt-[2px] text-gray-600">
                  <Link href="/admin/users">회원 목록</Link>
                </li>
                <li className="text-sm mt-[2px] text-gray-600">
                  파트너사 목록
                </li>
              </ul>
            </li>
            <Separator />
            <li className="p-5 my-4">
              <span className="text-lg font-bold">메뉴3</span>
              <ul className="mt-2">
                <li className="text-sm mt-[2px] text-gray-600">메뉴3-1</li>
                <li className="text-sm mt-[2px] text-gray-600">메뉴3-2</li>
                <li className="text-sm mt-[2px] text-gray-600">메뉴3-3</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="flex-grow bg-white p-6">{children}</div>
      </div>
    </AdminProtectedRoute>
  );
}
