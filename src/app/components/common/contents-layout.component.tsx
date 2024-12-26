'use client';

import AdminProtectedRoute from '@/app/admin/admin-protected-route.component';
import Loading from '@/app/components/common/loading.component';
import MenuNavigation from '@/app/components/common/menu-navigation.component';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';

export default function ContentsLayout({
  isAdmin,
  isPartner,
  isMy,
  children,
}: {
  isAdmin?: boolean;
  isPartner?: boolean;
  isMy?: boolean;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ProtectedRouteComponent = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    return isMy ? (
      <>{children}</>
    ) : (
      <AdminProtectedRoute>{children}</AdminProtectedRoute>
    );
  };

  return (
    <ProtectedRouteComponent>
      <Loading />
      <div className="h-full bg-gradient-to-br to-gray-100">
        <div className="flex h-full">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="lg:hidden fixed top-6 left-2 z-50 bg-white/80 hover:bg-white/90 rounded border border-gray-200 shadow-sm transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <MdClose className="h-5 w-5 text-gray-600" />
            ) : (
              <MdMenu className="h-5 w-5 text-gray-600" />
            )}
          </Button>

          {/* Sidebar */}
          <aside
            className={cn(
              'h-[calc(100%-2rem)] w-48 bg-gray-50/80 border-r border-gray-200 transition-transform duration-200 ease-in-out overflow-hidden lg:static my-4 mx-4 rounded-2xl shadow-lg',
              isSidebarOpen
                ? 'fixed inset-y-0 left-0 z-40 translate-x-0'
                : 'fixed inset-y-0 left-0 z-40 -translate-x-full lg:translate-x-0'
            )}
          >
            <div className="flex flex-col h-full">
              <nav className="flex-1 overflow-y-auto">
                <MenuNavigation
                  title={isPartner ? '파트너' : isAdmin ? '관리자' : '마이'}
                  isMy={isMy}
                  setIsSidebarOpen={setIsSidebarOpen}
                  isSidebarOpen={isSidebarOpen}
                />
              </nav>
            </div>
          </aside>

          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 p-4">
            <Breadcrumb
              type={isPartner ? 'partner' : isAdmin ? 'admin' : 'my'}
            />
            <div className="bg-white rounded-2xl shadow-lg h-[calc(100%-3rem)] overflow-auto">
              <div className="mt-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRouteComponent>
  );
}
