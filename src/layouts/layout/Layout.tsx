import Footer from '@/layouts/footer/Footer';
import Header from '@/layouts/header/Header';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="root-layout min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        {/* 배경 이미지 오버레이 */}
        <div 
          className="absolute inset-0 bg-[url('/images/slide1.jpg')] bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)), url('/images/slide1.jpg')`
          }}
        />
        
        {/* 컨텐츠 */}
        <div className="relative h-full">
          {children}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
