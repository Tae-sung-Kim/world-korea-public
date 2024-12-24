import BackgroundOverlay from '@/components/common/BackgroundOverlay';
import Footer from '@/layouts/footer/Footer';
import Header from '@/layouts/header/Header';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="root-layout h-screen flex flex-col w-full overflow-hidden">
      <Header className="shrink-0" />
      <main className="flex-1 relative w-full min-h-0">
        <BackgroundOverlay />

        {/* 컨텐츠 */}
        <div className="relative w-full h-full max-w-[1440px] mx-auto">
          {children}
        </div>
      </main>
      <Footer className="shrink-0" />
      <Toaster />
    </div>
  );
}
