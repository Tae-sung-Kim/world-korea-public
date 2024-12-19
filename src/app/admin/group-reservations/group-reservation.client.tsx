'use client';

import ExportExcelButton from '../components/export-excel-button.component';
import GroupReservationList from './group-reservation-list.client';
import { useRef } from 'react';

export default function GroupReservationClient() {
  const tableIdRef = useRef('reservationList');

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1920px] mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <ExportExcelButton
          tableId={tableIdRef.current}
          fileName="단체예약 리스트"
        />
      </div>
      <GroupReservationList tableId={tableIdRef.current} />
    </div>
  );
}
