import AccessPanel from '@/layouts/accessPanel/AccessPanel';
import MainNav from '@/layouts/mainNav/MainNav';

export default function Header() {
  return (
    <header className="relative">
      <div 
        className="absolute inset-0 bg-[url('/images/slide1.jpg')] bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5)), url('/images/slide1.jpg')`
        }}
      />
      <div className="relative">
        <AccessPanel />
        <MainNav />
      </div>
    </header>
  );
}
