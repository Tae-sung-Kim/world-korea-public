'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tickets } from '@/definitions';
import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  pinNumber?: string;
  tickets?: Tickets[];
};

const QrCodeWrapper = ({
  gridCols = 3,
  children,
}: {
  gridCols: number;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`grid gap-4 w-full ${
        gridCols < 3
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      }`}
    >
      {children}
    </div>
  );
};

export default function QrCodeModal({ pinNumber, tickets }: Props) {
  return (
    <div className="p-3 bg-white rounded-lg shadow-lg">
      {Array.isArray(tickets) && tickets.length > 0 ? (
        <ScrollArea className="w-full">
          <div className="space-y-4 min-h-[180px] max-h-[60vh]">
            <QrCodeWrapper gridCols={tickets.length}>
              {tickets.map((d) => (
                <div
                  key={d._id}
                  className="flex flex-col items-center p-3 bg-gray-50 rounded-lg transition-transform hover:scale-105"
                >
                  <QRCodeCanvas
                    value={window.location.origin + '/short/o/' + d.shortId}
                    className="w-full max-w-[180px] h-auto"
                  />
                  <span className="mt-1.5 text-sm text-gray-600 break-all text-center">
                    {d.shortId}
                  </span>
                </div>
              ))}
            </QrCodeWrapper>
          </div>
        </ScrollArea>
      ) : (
        <>
          {pinNumber && (
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg transition-transform hover:scale-105">
                <QRCodeCanvas
                  value={pinNumber}
                  className="w-full max-w-[220px] h-auto"
                />
              </div>
              <span className="text-sm text-gray-600 break-all text-center">
                {pinNumber}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
