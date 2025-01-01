'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Tickets } from '@/definitions';
import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  pinNumber?: string;
  tickets?: Tickets[];
};

const SingleQRCode = ({ value }: { value: string }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-8">
      <Card className="relative w-full aspect-square max-w-[300px] p-6 group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <QRCodeCanvas
          value={value}
          className="w-full h-full relative z-10"
        />
      </Card>
      <span className="mt-4 text-sm sm:text-base font-medium text-gray-700 break-all text-center">
        {value}
      </span>
    </div>
  );
};

const QRCodeGrid = ({ tickets }: { tickets: Tickets[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {tickets.map((ticket) => (
        <div key={ticket._id} className="flex flex-col">
          <Card className="group relative w-full aspect-square p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <QRCodeCanvas
              value={window.location.origin + '/short/o/' + ticket.shortId}
              className="relative w-full h-full z-10"
            />
          </Card>
          <span className="mt-3 text-sm font-medium text-gray-600 break-all text-center group-hover:text-gray-800 transition-colors duration-300">
            {ticket.shortId}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function QrCodeModal({ pinNumber, tickets }: Props) {
  return (
    <Card className="relative w-full min-h-[200px] max-h-[80vh] bg-gradient-to-br from-gray-50 to-white p-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <ScrollArea className="relative w-full h-full z-10">
        <div className="space-y-6">
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
