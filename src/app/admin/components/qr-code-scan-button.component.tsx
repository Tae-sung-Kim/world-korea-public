import QrCodeScanModal from '../modals/qr-code-scan.modal';
import { Button } from '@/components/ui/button';
import { useModalContext } from '@/contexts/modal.context';
import { BsQrCode } from 'react-icons/bs';

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
    <Button
      className="m-5"
      size="icon"
      variant="outline"
      onClick={handleQRCodeScan}
    >
      <BsQrCode />
    </Button>
  );
}
