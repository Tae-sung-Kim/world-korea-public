import { Button } from '@/components/ui/button';
import QrScanner from 'qr-scanner';
import { useCallback, useEffect, useRef } from 'react';

export default function QrCodeScanModal({
  onCancel,
  onResiveData,
}: {
  onCancel?: () => void;
  onResiveData?: (qrData: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScan = useCallback(
    (result: QrScanner.ScanResult) => {
      if (!!result.data) {
        //여기서 먼저 api 요청 후 성공시 값 입력, 이미 사용된  QR이라면 안 보냄
        onResiveData && onResiveData(result.data);
        onCancel && onCancel();
      }
    },
    [onResiveData, onCancel]
  );

  useEffect(() => {
    (async () => {
      const videoElement = videoRef.current;

      if (videoElement) {
        const qrScanner = new QrScanner(
          videoElement,
          (result) => handleScan(result),
          QrOptions
        );
        await qrScanner.start();

        return () => qrScanner.destroy();
      }
    })();
  }, [handleScan]);

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
