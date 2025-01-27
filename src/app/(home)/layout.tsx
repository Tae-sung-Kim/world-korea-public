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
        <div className="w-full px-4 py-4 h-full overflow-auto">{children}</div>
      </HomeProtectedRoute>
    </Layout>
  );
}
