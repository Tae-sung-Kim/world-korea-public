'use client';

import MenuNavigation from '../components/common/menu-navigation.component';
import AdminProtectedRoute from '@/app/admin/admin-protected-route.component';
import Loading from '@/app/components/common/loading.component';
import Breadcrumb from '@/components/ui/breadcrumb';
import Layout from '@/layouts/layout/Layout';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <AdminProtectedRoute>
        <Loading />
        <div className="min-h-screen bg-gradient-to-br to-gray-100">
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-[180px] lg:w-64 bg-white shadow-lg shrink-0 sticky top-0 h-screen overflow-y-auto">
              <MenuNavigation />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <Breadcrumb type="admin" />
                <div className="mt-4 sm:mt-6">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </AdminProtectedRoute>
    </Layout>
  );
}
