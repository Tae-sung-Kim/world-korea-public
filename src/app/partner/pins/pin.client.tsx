'use client';

import ExportExcelButton from '@/app/admin/components/export-excel-button.component';
import PinSearch from '@/app/admin/pins/pin-search.component';
import PinList from '@/app/components/pins/pin-list.component';
import { useRef } from 'react';

export default function PinClient() {
  const tableIdRef = useRef('pinExportExcelTable');

  return (
    <div className="content-search-container">
      <div className="list-search-buttons">
        <div className="flex-1 max-w-xl">
          <PinSearch />
        </div>
        <ExportExcelButton tableId={tableIdRef.current} fileName="핀리스트" />
      </div>

      <PinList tableId={tableIdRef.current} isPartner={true} />
    </div>
  );
}
