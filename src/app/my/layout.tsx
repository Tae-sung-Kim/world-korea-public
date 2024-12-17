'use client';

import MenuNavigation from '../components/common/menu-navigation.component';
import Layout from '@/layouts/layout/Layout';

export default function MyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br to-gray-100">
        <div className="flex min-w-[1024px] min-h-screen">
          {/* Sidebar */}
          <div className="w-[180px] lg:w-64 bg-white shadow-lg shrink-0 sticky top-0 h-screen">
            <MenuNavigation title="나의" isMy />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 min-w-[760px]">
            <div className="bg-white rounded-lg shadow-sm p-6">{children}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
