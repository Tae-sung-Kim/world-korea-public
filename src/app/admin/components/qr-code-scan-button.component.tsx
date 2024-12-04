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
      className="relative inline-flex items-center gap-1 sm:gap-2 rounded-lg bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={handleQRCodeScan}
    >
      <BsQrCode className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
      <span className="hidden sm:inline">QR 스캔</span>
      <span className="sm:hidden">스캔</span>
    </Button>
  );
}
