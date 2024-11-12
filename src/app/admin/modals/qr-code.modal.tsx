import { ScrollArea } from '@/components/ui/scroll-area';
import { Tickets } from '@/definitions';
import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  pinNumber?: string; // 단건 - 핀번호 사용 목록
  tickets?: Tickets[]; // 다건 - 구매 목록
};

export default function QrCodeModal({ pinNumber, tickets }: Props) {
  return (
    <ScrollArea className="min-h-52 h-[400px]">
      <div className="space-y-8">
        <div className="grid grid-cols-4">
          {Array.isArray(tickets) &&
            tickets.length > 0 &&
            tickets.map((d) => (
              <QRCodeCanvas
                key={d._id}
                value={window.location.href + d.shortId}
                className="m-10"
              />
            ))}
          {pinNumber && <QRCodeCanvas value={pinNumber} className="m-10" />}
        </div>
      </div>
    </ScrollArea>
  );
}
