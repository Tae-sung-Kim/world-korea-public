import BackgroundOverlay from '@/components/common/BackgroundOverlay';
import cn from 'classnames';

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('relative border-t border-gray-200 bg-white/95 py-2', className)}>
      <BackgroundOverlay className="opacity-70" />
      <div className="relative max-w-[1440px] mx-auto px-4">
        <div className="text-xs space-y-1">
          <p className="font-bold text-gray-800">월드코리아</p>
          <p className="text-gray-600">
            서울특별시 송파구 올림픽로 240, 롯데월드 웰빙센터 SP라운지 219호
            <span className="mx-2">|</span>
            대표: 홍선기
          </p>
          <p className="text-gray-600">
            02-415-8587 | 010-4074-8587 | worldk70@daum.net
          </p>
          <p className="text-gray-500">
            Copyright worldk70.com All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
