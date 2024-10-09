import { splitFourChar } from '../pins/pin.utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QRCodeCanvas } from 'qrcode.react';
import { MouseEventHandler, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

type Props = {
  pinList: string[];
  onCancel?: () => void;
};

export default function QrCodePrintModal({ pinList, onCancel }: Props) {
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({ contentRef: printRef });

  const handlePrintClick: MouseEventHandler<HTMLButtonElement> = () => {
    handlePrint();
  };

  return (
    <div className="space-y-8">
      <ScrollArea className="h-[600px]">
        <div
          className="grid grid-cols-2 print:h-screen print:m-0 print:p-0"
          ref={printRef}
        >
          {pinList.length > 0 &&
            pinList.map((d) => {
              return (
                <div key={d} className="m-24 space-y-2">
                  <h1>{splitFourChar(d)}</h1>
                  <QRCodeCanvas value={d} />
                </div>
              );
            })}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-center pb-5 space-x-5">
        <Button type="button" onClick={onCancel}>
          닫기
        </Button>
        <Button type="button" onClick={handlePrintClick}>
          출력
        </Button>
      </div>
    </div>
  );
}
