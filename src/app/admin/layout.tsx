'use client';

import AdminProtectedRoute from '@/app/admin/admin-protected-route.component';
import Breadcrumb from '@/components/ui/breadcrumb';
import Loading from '@/app/components/loading.component';
import { ADMIN_MENU } from '@/definitions/menu.constant';
import { MenuKey } from '@/definitions/menu.type';
import Layout from '@/layouts/layout/Layout';
import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';
import { AiOutlineNotification, AiOutlineProduct } from 'react-icons/ai';
import { BiPurchaseTag } from 'react-icons/bi';
import { TbTicket, TbUser } from 'react-icons/tb';
import { TiSortNumericallyOutline } from 'react-icons/ti';

const MENU_ICONS: Record<MenuKey, IconType> = {
  product: AiOutlineProduct,
  sales: BiPurchaseTag,
  purchase: TbTicket,
  member: TbUser,
  pin: TiSortNumericallyOutline,
  popup: AiOutlineNotification,
} as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <AdminProtectedRoute>
        <Loading />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
          <div className="flex min-w-[1024px]">
            {/* Sidebar */}
            <div className="w-[180px] lg:w-64 bg-white shadow-lg shrink-0 sticky top-0 h-screen">
              <div className="h-full flex flex-col">
                <div className="p-2 lg:p-4 border-b border-gray-200">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                      관리자 메뉴
                    </h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-2 rounded-full"></div>
                  </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-2 lg:py-4">
                  <ul className="space-y-1 px-1 lg:px-3">
                    {ADMIN_MENU.map((section, index) => (
                      <li key={section.label}>
                        <div className="mb-2 lg:mb-4">
                          <span className="flex items-center px-2 py-2 text-gray-800 rounded-lg bg-gray-50 shadow-sm">
                            {section.key in MENU_ICONS && (
                              <span className="mr-1.5 lg:mr-3">
                                {React.createElement(
                                  MENU_ICONS[section.key as MenuKey],
                                  {
                                    className: 'w-5 h-5 text-indigo-600',
                                  }
                                )}
                              </span>
                            )}
                            <span className="font-semibold text-sm lg:text-base">
                              {section.label}
                            </span>
                          </span>
                          <ul className="mt-1 lg:mt-2 space-y-0.5 lg:space-y-1">
                            {section.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  className="block px-4 lg:px-8 py-1.5 lg:py-2 text-xs lg:text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md transition-colors duration-150"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 min-w-[760px]">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Breadcrumb type="admin" />
                {children}
              </div>
            </div>
          </div>
        </div>
      </AdminProtectedRoute>
    </Layout>
  );
}
