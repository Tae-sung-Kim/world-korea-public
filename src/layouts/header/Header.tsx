import AccessPanel from '@/layouts/accessPanel/AccessPanel';
import MainNav from '@/layouts/mainNav/MainNav';
import BackgroundOverlay from '@/components/common/BackgroundOverlay';

export default function Header() {
  return (
    <header className="relative">
      <BackgroundOverlay />
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <AccessPanel />
        <MainNav />
      </div>
    </header>
  );
}
