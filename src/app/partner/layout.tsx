'use client';

import MenuNavigation from '../components/common/menu-navigation.component';
import AdminProtectedRoute from '@/app/admin/admin-protected-route.component';
import Loading from '@/app/components/common/loading.component';
import Breadcrumb from '@/components/ui/breadcrumb';
import { PARTNER_MENU } from '@/definitions/menu.constant';
import Layout from '@/layouts/layout/Layout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { IconType } from 'react-icons';
import { TbTicket } from 'react-icons/tb';
import { TiSortNumericallyOutline } from 'react-icons/ti';

type PartnerMenuKey = 'purchase' | 'pin';

const MENU_ICONS: Record<PartnerMenuKey, IconType> = {
  purchase: TbTicket,
  pin: TiSortNumericallyOutline,
} as const;

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Layout>
      <AdminProtectedRoute>
        <Loading />
        <div className="min-h-screen bg-gradient-to-br to-gray-100 overflow-auto">
          <div className="flex min-w-[1024px]">
            {/* Sidebar */}
            <div className="w-[180px] lg:w-64 bg-white shadow-lg shrink-0 sticky top-0 h-screen">
              <MenuNavigation title="파트너" />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 min-w-[760px]">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Breadcrumb type="partner" />
                {children}
              </div>
            </div>
          </div>
        </div>
      </AdminProtectedRoute>
    </Layout>
  );
}
