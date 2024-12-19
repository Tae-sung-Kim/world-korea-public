'use client';

import MenuNavigation from '../components/common/menu-navigation.component';
import Layout from '@/layouts/layout/Layout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MdMenu, MdClose } from 'react-icons/md';
import { cn } from '@/lib/utils';

export default function MyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br to-gray-100">
        <div className="flex min-h-screen relative">
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
              'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64',
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className="flex flex-col h-full">
              <div className="h-16" /> {/* 헤더 높이만큼 빈 공간 */}
              <nav className="flex-1 px-4 overflow-y-auto">
                <MenuNavigation title="마이페이지" />
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
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
