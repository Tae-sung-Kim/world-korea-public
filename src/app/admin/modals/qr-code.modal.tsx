import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  pinNumber: string;
};

export default function QrCodeModal({ pinNumber = '' }: Props) {
  return (
    <div className="space-y-8">
      <div className="flex justify-center items-stretch">
        <div className="py-8">
          <QRCodeCanvas value={pinNumber} />
        </div>
      </div>
    </div>
  );
}
