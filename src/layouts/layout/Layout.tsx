import { Toaster } from '@/components/ui/toaster';
import Footer from '@/layouts/footer/Footer';
import Header from '@/layouts/header/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="root-layout">
      <Header />
      <main>
        {children}
        <Footer />
      </main>
      <Toaster />
    </div>
  );
}
