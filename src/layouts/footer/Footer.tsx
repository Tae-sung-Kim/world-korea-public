import BackgroundOverlay from '@/components/common/BackgroundOverlay';

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <BackgroundOverlay className="opacity-50" />
      <div className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col text-sm py-6">
        <span className="font-bold text-gray-800 mb-2">월드코리아</span>
        <div className="text-gray-600 flex flex-col sm:flex-row gap-2">
          <span className="break-keep">
            주소: 서울특별시 송파구 올림픽로 240, 롯데월드 웰빙센터 SP라운지
            219호
          </span>
          <span className="hidden sm:block">|</span>
          <span>대표: 홍선기</span>
        </div>
        <div className="text-gray-600 break-keep">
          <span>02-415-8587 | 010-4074-8587 | worldk70@daum.net</span>
        </div>

        <span className="text-gray-500 mt-5">
          Copyright  worldk70.com All right reserved.
        </span>
      </div>
    </footer>
  );
}
