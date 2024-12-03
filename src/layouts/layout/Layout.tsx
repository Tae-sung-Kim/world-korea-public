import BackgroundOverlay from '@/components/common/BackgroundOverlay';
import Footer from '@/layouts/footer/Footer';
import Header from '@/layouts/header/Header';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="root-layout min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-1 relative w-full">
        <BackgroundOverlay />

        {/* 컨텐츠 */}
        <div className="relative h-full w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
