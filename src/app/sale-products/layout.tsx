import Layout from '@/layouts/layout/Layout';

export default function SaleProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="h-full w-full bg-gradient-to-br">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </Layout>
  );
}
