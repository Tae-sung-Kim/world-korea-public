'use client';

import ContentsLayout from '../components/common/contents-layout.component';
import Layout from '@/layouts/layout/Layout';

/**
 * @description A layout component for the my page.
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function MyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <ContentsLayout isMy={true}>{children}</ContentsLayout>
    </Layout>
  );
}
