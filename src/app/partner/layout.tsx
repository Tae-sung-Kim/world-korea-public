'use client';

import ContentsLayout from '../components/common/contents-layout.component';
import Layout from '@/layouts/layout/Layout';

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <ContentsLayout isPartner={true}>{children}</ContentsLayout>
    </Layout>
  );
}
