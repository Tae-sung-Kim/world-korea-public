import Footer from '@/layouts/footer/Footer';
import Header from '@/layouts/header/Header';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="root-layout">
      <Header />
      <main className="bg-gray-50">
        {children}
        <Footer />
      </main>
      <Toaster />
    </div>
  );
}
