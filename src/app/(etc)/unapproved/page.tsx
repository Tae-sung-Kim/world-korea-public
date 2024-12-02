export default function Unapproved() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 p-4">
      <div className="max-w-2xl text-center">
        <p className="font-mono font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl space-y-4 sm:space-y-6 md:space-y-8">
          승인되지 않은 회원입니다.
          <br className="hidden sm:block" />
          <br className="hidden sm:block" />
          담당자에게 문의 해주세요.
        </p>
      </div>
    </div>
  );
}
