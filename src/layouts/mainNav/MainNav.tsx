import Image from 'next/image';
import Link from 'next/link';

export default function MainNav() {
  return (
    <nav className="h-24 flex items-center justify-center">
      <div className="flex justify-between items-center w-[1200px]">
        <h1>
          <Link href="/">
            <Image
              src="/images/main_logo_invert.png"
              width={270}
              height={50}
              alt="Logo"
            />
          </Link>
        </h1>
        <ul className="flex items-center justify-center h-full text-xl gap-16">
          <li>
            <Link href="/products">일반회원</Link>
          </li>
          <li>
            <Link href="/">프리미엄회원</Link>
          </li>
          <li>
            <Link href="/">스페셜회원</Link>
          </li>
          <li>
            <Link href="/">선구매용</Link>
          </li>
          <li>
            <Link href="/groupReservation">단체예약</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
