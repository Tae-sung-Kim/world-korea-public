import Header from '@/layouts/header/Header';
import Footer from '@/layouts/footer/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="root-layout">
      <Header />
      <main>
        {children}
        <Footer />
      </main>
    </div>
  );
}
