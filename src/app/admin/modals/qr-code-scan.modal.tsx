import { Button } from '@/components/ui/button';
import { MODAL_TYPE, useModalContext } from '@/contexts/modal.context';
import pinsService from '@/services/pins.service';
import QrScanner from 'qr-scanner';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function QrCodeScanModal({
  onCancel,
  onResiveData,
}: {
  onCancel?: () => void;
  onResiveData?: (qrData: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openModal } = useModalContext();

  const qrScannerRef = useRef<QrScanner | null>(null); // qrScanner 인스턴스를 저장할 ref
  const [isProcessing, setIsProcessing] = useState(false); // 스캔 처리 중 상태

  const handleScan = useCallback(
    async (result: QrScanner.ScanResult) => {
      if (!result.data || isProcessing) return;

      //shortUrl 여부
      const isShortUrl =
        result.data.startsWith('http://') || result.data.startsWith('https://');

      // if (isShortUrl) {
      //   qrNumber  result.data.split()= '';
      // }

      try {
        setIsProcessing(true);
        qrScannerRef.current?.stop(); // 스캔 일시 중지

        const usedPinQrCode = await pinsService.usedPinQrCode(
          result.data.replaceAll('-', '')
        );

        if (usedPinQrCode) {
          await openModal({
            type: MODAL_TYPE.ALERT,
            title: result.data,
            content: `${result.data}는 이미 사용된 코드입니다.\n다시 확인해 주세요.`,
            onOk: () => qrScannerRef.current?.start(),
          });
          qrScannerRef.current?.start(); // 스캔 재개
        } else {
          onResiveData?.(result.data);
          onCancel?.();
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [onResiveData, onCancel, openModal, isProcessing]
  );

  useEffect(() => {
    (async () => {
      const videoElement = videoRef.current;

      if (videoElement && !qrScannerRef.current) {
        const qrScanner = new QrScanner(videoElement, handleScan, QrOptions);

        qrScannerRef.current = qrScanner;

        await qrScanner.start();

        return () => {
          qrScanner.destroy();
          qrScannerRef.current = null;
        };
      }
    })();
  }, [handleScan]);

  return (
    <div className="flex flex-col items-center space-y-4 p-2 sm:p-4 w-full">
      <div className="relative w-full max-w-[90vw] sm:max-w-md aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-900">
        <video ref={videoRef} className="w-full h-full object-cover" />
        <div className="absolute inset-0 border-2 border-blue-400 opacity-50 animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-36 h-36 sm:w-48 sm:h-48 border-2 border-white/50 rounded-lg"></div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
        <Button
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          취소
        </Button>
      </div>
    </div>
  );
}

export const QrOptions = {
  // 핸드폰의 경우, 외부 카메라인지 셀프카메라인지
  preferredCamera: 'environment',
  // 1초당 몇번의 스캔을 할 것인지? ex) 1초에 60번 QR 코드 감지한다.
  maxScansPerSecond: 1,
  // QR 스캔이 일어나는 부분을 표시해줄 지 (노란색 네모 테두리가 생긴다.)
  highlightScanRegion: true,
};
