import Layout from '@/layouts/layout/Layout';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="container flex items-center justify-center">
        <div className="w-[800px] py-24 px-6">{children}</div>
      </div>
    </Layout>
  );
}
