import {
  RiErrorWarningLine,
  RiPhoneLine,
  RiSmartphoneLine,
} from 'react-icons/ri';

export default function Unapproved() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          <div className="rounded-full bg-red-50 p-3">
            <RiErrorWarningLine className="w-12 h-12 text-red-400" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              승인되지 않은 회원입니다.
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              서비스 이용을 위해서는 담당자의 승인이 필요합니다.
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-500">
              문의사항이 있으시다면 담당자에게 연락해 주세요.
            </p>
          </div>
          <div className="w-full max-w-xs border-t pt-6 mt-2">
            <div className="text-center">
              <h2 className="font-medium text-gray-900 mb-3">담당자 연락처</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <RiPhoneLine className="w-4 h-4" />
                  <span>02-415-8587</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <RiSmartphoneLine className="w-4 h-4" />
                  <span>010-4074-8587</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
