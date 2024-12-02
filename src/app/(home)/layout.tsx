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
        <div className="container mx-auto flex items-center justify-center min-h-screen">
          <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[1100px] xl:max-w-[1300px] py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </HomeProtectedRoute>
    </Layout>
  );
}
