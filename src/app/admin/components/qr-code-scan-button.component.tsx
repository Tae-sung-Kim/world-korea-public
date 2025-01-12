import QrCodeScanModal from '../modals/qr-code-scan.modal';
import { Button } from '@/components/ui/button';
import { useModalContext } from '@/contexts/modal.context';
import { LuQrCode } from 'react-icons/lu';

type Props = {
  modalTitle?: string;
  showFooter?: boolean;
  onResiveData?: (qrData: string) => void;
};

export default function QrCodeScanButton({
  modalTitle = 'QR CODE SCAN',
  showFooter = false,
  onResiveData,
}: Props) {
  const { openModal } = useModalContext();

  const handleQRCodeScan = async () => {
    return await openModal({
      title: modalTitle,
      showFooter,
      Component: ({ onCancel }) => {
        return (
          <QrCodeScanModal onCancel={onCancel} onResiveData={onResiveData} />
        );
      },
    });
  };

  return (
    <Button variant="outline" size="icon" onClick={handleQRCodeScan}>
      <LuQrCode className="sm:h-5 sm:w-5" />
    </Button>
  );
}
