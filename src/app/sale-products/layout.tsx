import Layout from '@/layouts/layout/Layout';

export default function SaleProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background/80 to-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
}
