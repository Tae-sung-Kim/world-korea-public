import Layout from '@/layouts/layout/Layout';

export default function SaleProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {children}
        </div>
      </div>
    </Layout>
  );
}
