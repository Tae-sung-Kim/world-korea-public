'use client';

import ContentsLayout from '../components/common/contents-layout.component';
import Layout from '@/layouts/layout/Layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <ContentsLayout isAdmin={true}>{children}</ContentsLayout>
    </Layout>
  );
}
