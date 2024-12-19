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
            className="lg:hidden fixed top-4 left-4 z-50"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <MdClose className="h-6 w-6" />
            ) : (
              <MdMenu className="h-6 w-6" />
            )}
          </Button>

          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-40",
              "w-[240px] bg-white shadow-lg shrink-0 h-screen overflow-y-auto",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="pt-16 lg:pt-0">
              <MenuNavigation title="나의" isMy />
            </div>
          </div>

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
