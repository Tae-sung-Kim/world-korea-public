import AccessPanel from '../accessPanel/AccessPanel';
import MainNav from '@/layouts/mainNav/MainNav';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'relative opacity-70 border-gray-200 bg-white/95',
        className
      )}
    >
      <nav className="w-full list-table-row">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-0">
            <h1 className="flex justify-center sm:justify-start flex-shrink-0 mb-2 sm:mb-0">
              <Link href="/" className="block py-2 ml-12">
                <Image
                  src="/images/main_logo_invert.png"
                  width={250}
                  height={40}
                  alt="World Korea Logo"
                  className="w-[180px] sm:w-[200px] h-[35px]"
                  priority
                />
              </Link>
            </h1>
            <div className="flex justify-center sm:justify-end">
              <AccessPanel />
            </div>
          </div>
        </div>
      </nav>
      {/* <MainNav /> */}
    </header>
  );
}
