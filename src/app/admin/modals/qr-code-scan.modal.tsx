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
      if (!!result.data && !isProcessing) {
        setIsProcessing(true);

        const usedPinQrCode = await pinsService.usedPinQrCode(
          result.data.replaceAll('-', '')
        );

        if (usedPinQrCode) {
          openModal({
            type: MODAL_TYPE.ALERT,
            title: result.data,
            content: `${result.data}는 이미 사용된 코드입니다.\n다시 확인해 주세요.`,
          });
        } else {
          onResiveData && onResiveData(result.data);
          onCancel && onCancel();
        }
      }
    },
    [onResiveData, onCancel, openModal, isProcessing]
  );

  useEffect(() => {
    (async () => {
      const videoElement = videoRef.current;

      if (videoElement && !qrScannerRef.current) {
        const qrScanner = new QrScanner(
          videoElement,
          (result) => {
            if (!isProcessing) {
              return handleScan(result);
            }
          },
          QrOptions
        );

        qrScannerRef.current = qrScanner;

        await qrScanner.start();

        return () => qrScanner.destroy();
      }
    })();
  }, [handleScan, isProcessing]);

  return (
    <div className="space-y-8">
      <video
        ref={videoRef}
        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
        autoPlay
        playsInline
      />

      <Button onClick={onCancel}>닫기</Button>
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
