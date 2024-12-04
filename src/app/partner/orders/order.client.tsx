'use client';

import ExportExcelButton from '@/app/admin/components/export-excel-button.component';
import OrderList from '@/app/components/orders/order-list.component';
import { useRef } from 'react';

export default function OrderClient() {
  const tableIdRef = useRef('partnerOrderExportExcelTable');

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1920px] mx-auto px-4">
      <div className="flex items-center justify-end mb-4">
        <ExportExcelButton tableId={tableIdRef.current} fileName="주문리스트" />
      </div>
      <OrderList tableId={tableIdRef.current} />
    </div>
  );
}
