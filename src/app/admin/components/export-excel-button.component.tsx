import useExcelExport from '../hooks/useExcelExport';
import { Button } from '@/components/ui/button';
import { RiFileExcel2Line } from 'react-icons/ri';

type ExportExcelButton = {
  tableId: string;
  fileName: string;
};

export default function ExportExcelButton({
  tableId,
  fileName,
}: ExportExcelButton) {
  const exportToExcel = useExcelExport();

  return (
    <>
      <div className="flex-grow" />

      <Button
        className="m-5"
        variant="outline"
        size="icon"
        onClick={() =>
          exportToExcel({
            tableId,
            fileName,
          })
        }
      >
        <RiFileExcel2Line />
      </Button>
    </>
  );
}
