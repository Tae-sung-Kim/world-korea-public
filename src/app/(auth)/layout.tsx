import Layout from '@/layouts/layout/Layout';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="flex items-center justify-center flex-1">
        <div className="w-full max-w-[800px] px-6">{children}</div>
      </div>
    </Layout>
  );
}
