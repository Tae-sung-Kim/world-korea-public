import AccessPanel from '../accessPanel/AccessPanel';
import Image from 'next/image';
import Link from 'next/link';

export default function MainNav() {
  return (
    <nav className="w-full border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <h1 className="flex-shrink-0">
              <Link href="/" className="block">
                <Image
                  src="/images/main_logo_invert.png"
                  width={250}
                  height={40}
                  alt="World Korea Logo"
                  className="w-[250px] h-[40px]"
                />
              </Link>
            </h1>
          </div>
          <AccessPanel />
        </div>
      </div>
    </nav>
  );
}
