import { Button } from '@/components/ui/button';
import { Tickets } from '@/definitions';
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

  const getGridConfig = (count: number) => {
    if (count <= 1)
      return {
        cols: 'grid-cols-1',
        qrSize: 'w-[200px] h-[200px]',
      };
    if (count <= 4)
      return {
        cols: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        qrSize: 'w-[180px] h-[180px] sm:w-[160px] sm:h-[160px]',
      };
    if (count <= 10)
      return {
        cols: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        qrSize: 'w-[180px] h-[180px] sm:w-[140px] sm:h-[140px]',
      };
    return {
      cols: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      qrSize: 'w-[180px] h-[180px] sm:w-[120px] sm:h-[120px]',
    };
  };

  const config = getGridConfig(tickets.length);

  return (
    <div className="flex flex-col max-h-[90vh]">
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="p-3 sm:p-4" ref={printRef}>
          <div
            className={`grid gap-3 sm:gap-4 place-items-center ${config.cols}`}
          >
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="flex flex-col items-center p-2 sm:p-3 space-y-2 sm:space-y-3 border rounded-lg bg-white"
              >
                {/* <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {ticket.shortId}
                </span> */}
                <div className="w-full flex items-center justify-center">
                  <QRCodeCanvas
                    value={
                      window.location.origin + '/short/o/' + ticket.shortId
                    }
                    size={200}
                    level="H"
                    className={config.qrSize}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 form-button-area gap-2 p-4 border-t bg-white">
        <Button variant="cancel" onClick={onCancel}>
          닫기
        </Button>
        <Button variant="utility" onClick={handlePrintClick}>
          출력
        </Button>
      </div>
    </div>
  );
}
