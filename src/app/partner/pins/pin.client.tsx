'use client';

import ExportExcelButton from '@/app/admin/components/export-excel-button.component';
import PinList from '@/app/components/pins/pin-list.component';
import { useRef } from 'react';

export default function PinClient() {
  const tableIdRef = useRef('pinExportExcelTable');

  return (
    <>
      <div className="flex">
        <ExportExcelButton tableId={tableIdRef.current} fileName="핀리스트" />
      </div>
      <PinList tableId={tableIdRef.current} />
    </>
  );
}
