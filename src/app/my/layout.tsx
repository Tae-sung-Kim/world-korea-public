import Layout from '@/layouts/layout/Layout';

export default function MyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="w-full px-4 py-8">
        {children}
      </div>
    </Layout>
  );
}
