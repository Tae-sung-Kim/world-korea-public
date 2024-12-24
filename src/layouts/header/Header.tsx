import BackgroundOverlay from '@/components/common/BackgroundOverlay';
// import AccessPanel from '@/layouts/accessPanel/AccessPanel';
import MainNav from '@/layouts/mainNav/MainNav';
import cn from 'classnames';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={cn('relative', className)}>
      <BackgroundOverlay />
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* <AccessPanel /> */}
        <MainNav />
      </div>
    </header>
  );
}
