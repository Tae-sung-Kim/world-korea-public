import AccessPanel from '../accessPanel/AccessPanel';
import Image from 'next/image';
import Link from 'next/link';

export default function MainNav() {
  return (
    <nav className="w-full border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-0">
          <h1 className="flex justify-center sm:justify-start flex-shrink-0 sm:ml-12 mb-4 sm:mb-0">
            <Link href="/" className="block">
              <Image
                src="/images/main_logo_invert.png"
                width={250}
                height={40}
                alt="World Korea Logo"
                className="w-[200px] sm:w-[250px] h-[40px]"
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
  );
}
