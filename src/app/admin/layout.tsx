'use client';

import AdminProtectedRoute from '@/app/admin/admin-protected-route.component';
import Loading from '@/app/components/loading.component';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/layout/Layout';
import Link from 'next/link';
import { AiOutlineNotification, AiOutlineProduct } from 'react-icons/ai';
import { BiPurchaseTag } from 'react-icons/bi';
import { TbTicket, TbUser } from 'react-icons/tb';
import { TiSortNumericallyOutline } from 'react-icons/ti';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <AdminProtectedRoute>
        <Loading />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="flex min-h-screen min-w-[1024px]">
            <aside className="w-72 min-w-72 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="flex flex-col flex-grow pt-5 pb-4">
                <div className="flex items-center justify-center px-4 mb-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent pb-1">
                      관리자 페이지
                    </h2>
                    <div className="h-1 w-24 mx-auto bg-gradient-to-r from-gray-700 to-gray-400 rounded-full mt-1"></div>
                  </div>
                </div>
                <nav className="flex-1 px-3 space-y-1">
                  <ul>
                    <li className="p-5 my-4">
                      <span className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                        <TbTicket className="w-5 h-5" />
                        상품 관리
                      </span>
                      <ul className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/products"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            상품 목록
                          </Link>
                        </li>
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/products/create"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            상품 등록
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <Separator className="bg-gray-100" />
                    <li className="p-5 my-4">
                      <span className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                        <AiOutlineProduct className="w-5 h-5" />
                        판매 관리
                      </span>
                      <ul className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/sale-products"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            판매 목록
                          </Link>
                        </li>
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/sale-products/create"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            판매 등록
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <Separator className="bg-gray-100" />
                    <li className="p-5 my-4">
                      <span className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                        <BiPurchaseTag className="w-5 h-5" />
                        구매 관리
                      </span>
                      <ul className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/orders"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            구매 목록
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <Separator className="bg-gray-100" />
                    <li className="p-5 my-4">
                      <span className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                        <TbUser className="w-5 h-5" />
                        회원 관리
                      </span>
                      <ul className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/user-categories"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            회원 구분
                          </Link>
                        </li>
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/users"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            회원 목록
                          </Link>
                        </li>
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/users/partner"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            파트너사 목록
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <Separator className="bg-gray-100" />
                    <li className="p-5 my-4">
                      <span className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                        <TiSortNumericallyOutline className="w-5 h-5" />
                        핀번호 관리
                      </span>
                      <ul className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/pins"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            핀번호 목록
                          </Link>
                        </li>
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/pins/create"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            핀번호 생성
                          </Link>
                        </li>
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/pins/register"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            핀번호 등록
                          </Link>
                        </li>
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/pins/used"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            핀번호 사용
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <Separator className="bg-gray-100" />
                    <li className="p-5 my-4">
                      <span className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                        <AiOutlineNotification className="w-5 h-5" />
                        팝업 관리
                      </span>
                      <ul className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/notifications"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            팝업 목록
                          </Link>
                        </li>
                        <li className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <Link
                            href="/admin/notifications/create"
                            className="block hover:translate-x-1 transition-transform"
                          >
                            팝업 등록
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </aside>

            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </AdminProtectedRoute>
    </Layout>
  );
}
