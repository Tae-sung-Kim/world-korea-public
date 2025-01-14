import { splitFourChar } from '@/app/api/utils/pin.utils';
import { Button } from '@/components/ui/button';
import { MODAL_TYPE, useModalContext } from '@/contexts/modal.context';
import pinsService from '@/services/pins.service';
import shortService from '@/services/short.service';
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

      try {
        let qrCodeNumber: string = '';
        let shortId: string = '';
        setIsProcessing(true);
        qrScannerRef.current?.stop(); // 스캔 일시 중지

        //shortUrl 여부
        const isUrl =
          result.data.startsWith('http://') ||
          result.data.startsWith('https://');

        if (isUrl) {
          const splitData = result.data.split('/');
          shortId = splitData[splitData.length - 1];

          const { number } = await shortService.getTicketByShortId(
            String(shortId)
          );

          qrCodeNumber = number ?? '';
        }

        const usedPinQrCode = await pinsService.usedPinQrCode(qrCodeNumber);

        if (usedPinQrCode) {
          await openModal({
            type: MODAL_TYPE.ALERT,
            // title: qrCodeNumber,
            content: `${splitFourChar(
              qrCodeNumber
            )}는 이미 사용된 코드입니다.\n다시 확인해 주세요.`,
            onOk: () => qrScannerRef.current?.start(),
          });
          qrScannerRef.current?.start(); // 스캔 재개
        } else {
          onResiveData?.(qrCodeNumber);
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
        <div className="absolute inset-0 border-2 border-white/30 rounded-lg pointer-events-none"></div>
      </div>
      <Button variant="cancel" onClick={onCancel}>
        취소
      </Button>
    </div>
  );
}

export const QrOptions = {
  // 핸드폰의 경우, 외부 카메라인지 셀프카메라인지
  preferredCamera: 'environment',
  // 1초당 몇번의 스캔을 할 것인지? ex) 1초에 60번 QR 코드 감지한다.
  maxScansPerSecond: 3,
  // QR 스캔이 일어나는 부분을 표시해줄 지 (노란색 네모 테두리가 생긴다.)
  highlightScanRegion: true,
  canvas: { willReadFrequently: true },
};
