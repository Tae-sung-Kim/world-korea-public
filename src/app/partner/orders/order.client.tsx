'use client';

import ExportExcelButton from '@/app/admin/components/export-excel-button.component';
import OrderList from '@/app/components/orders/order-list.component';
import { useRef } from 'react';

export default function OrderClient() {
  const tableIdRef = useRef('partnerOrderExportExcelTable');

  return (
    <>
      <div className="flex">
        <ExportExcelButton tableId={tableIdRef.current} fileName="test" />
      </div>
      <OrderList tableId={tableIdRef.current} />
    </>
  );
}
