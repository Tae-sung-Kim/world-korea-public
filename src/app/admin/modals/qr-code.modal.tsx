'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tickets } from '@/definitions';
import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  pinNumber?: string;
  tickets?: Tickets[];
};

const SingleQRCode = ({ value }: { value: string }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <div className="flex flex-col items-center p-3 space-y-3 border rounded-lg bg-white">
        <span className="text-sm font-medium text-gray-900">{value}</span>
        <div className="w-full flex items-center justify-center">
          <QRCodeCanvas
            value={value}
            size={200}
            level="H"
            className="w-[200px] h-[200px]"
          />
        </div>
      </div>
    </div>
  );
};

const QRCodeGrid = ({ tickets }: { tickets: Tickets[] }) => {
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
    <div className={`grid gap-3 sm:gap-4 place-items-center ${config.cols}`}>
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="flex flex-col items-center p-2 sm:p-3 space-y-2 sm:space-y-3 border rounded-lg bg-white"
        >
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {ticket.shortId}
          </span>
          <div className="w-full flex items-center justify-center">
            <QRCodeCanvas
              value={window.location.origin + '/short/o/' + ticket.shortId}
              size={200}
              level="H"
              className={config.qrSize}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function QrCodeModal({ pinNumber, tickets }: Props) {
  return (
    <Card className="flex flex-col max-h-[90vh] bg-gray-50">
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 sm:p-4">
          {Array.isArray(tickets) && tickets.length > 0 ? (
            <QRCodeGrid tickets={tickets} />
          ) : (
            pinNumber && <SingleQRCode value={pinNumber} />
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
