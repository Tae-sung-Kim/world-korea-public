import BackgroundOverlay from '@/components/common/BackgroundOverlay';
import MainNav from '@/layouts/mainNav/MainNav';
import cn from 'classnames';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={cn('relative', className)}>
      <BackgroundOverlay />
      <MainNav />
    </header>
  );
}
