'use client';

import ExportExcelButton from '../components/export-excel-button.component';
import PinSearch from './pin-search.component';
import PinList from '@/app/components/pins/pin-list.component';
import { useRef } from 'react';

export default function PinClient() {
  const tableIdRef = useRef('pinExportExcelTable');

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1920px] mx-auto">
      <div className="flex mb-4">
        <PinSearch />
        <ExportExcelButton tableId={tableIdRef.current} fileName="핀리스트" />
      </div>
      <PinList tableId={tableIdRef.current} />
    </div>
  );
}
