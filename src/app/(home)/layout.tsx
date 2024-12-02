import HomeProtectedRoute from './home-protected-route.component';
import Layout from '@/layouts/layout/Layout';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <HomeProtectedRoute>
        <div className="w-full max-w-[1300px] mx-auto px-4 py-8">
          {children}
        </div>
      </HomeProtectedRoute>
    </Layout>
  );
}
