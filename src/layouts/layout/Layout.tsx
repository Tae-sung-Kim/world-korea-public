import Footer from '@/layouts/footer/Footer';
import Header from '@/layouts/header/Header';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="root-layout h-screen">
      <Header />
      <main className="bg-gray-50 bg-[url('/images/slide1.jpg')] h-max min-h-screen ">
        <div className="flex justify-center">{children}</div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
