import { splitFourChar } from '../pins/pin.utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tickets } from '@/definitions';
import cn from 'classnames';
import { QRCodeCanvas } from 'qrcode.react';
import { MouseEventHandler, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

type Props = {
  tickets: Tickets[];
  onCancel?: () => void;
};

export default function QrCodePrintModal({ tickets, onCancel }: Props) {
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({ contentRef: printRef });

  const handlePrintClick: MouseEventHandler<HTMLButtonElement> = () => {
    handlePrint();
  };

  const pinList = tickets.reduce<string[]>((acc, ticket) => {
    acc.push(...ticket.pins);
    return acc;
  }, []);

  // QR 코드 한 개당 필요한 최소 너비 계산 (패딩 포함)
  const qrCodeWidth = 320; // QR 코드 한 개의 너비 (패딩 포함)
  const calculateColumns = () => {
    const count = pinList.length;
    if (count <= 1) return 1;
    if (count <= 2) return 2;
    if (count <= 4) return 2;
    return 4;
  };

  const modalWidth = Math.min(qrCodeWidth * calculateColumns(), 1600); // 최대 너비는 1600px로 제한

  return (
    <div
      className="flex flex-col mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg relative"
      style={{ width: `${modalWidth}px`, maxWidth: '95vw' }}
    >
      <ScrollArea
        className="w-full border rounded-md"
        style={{ height: 'calc(100vh - 250px)' }}
      >
        <div
          className={cn(
            'grid gap-6 sm:gap-8 p-4 sm:p-6 print:h-screen print:m-0 print:p-0',
            {
              'grid-cols-1': pinList.length <= 1,
              'grid-cols-2': pinList.length > 1 && pinList.length <= 4,
              'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
                pinList.length > 4,
            }
          )}
          ref={printRef}
        >
          {pinList.length > 0 &&
            pinList.map((d) => {
              return (
                <div
                  key={d}
                  className="flex flex-col items-center justify-center p-4 sm:p-6 space-y-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h1 className="text-base sm:text-lg font-medium text-gray-900">
                    {splitFourChar(d)}
                  </h1>
                  <div className="p-2 bg-white rounded">
                    <QRCodeCanvas
                      value={d}
                      size={200}
                      className="w-[200px] sm:w-[240px] lg:w-[280px] h-auto"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </ScrollArea>
      <div className="h-10" />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center space-x-2 py-3 px-3 bg-white border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          닫기
        </Button>
        <Button type="button" onClick={handlePrintClick}>
          출력
        </Button>
      </div>
    </div>
  );
}
