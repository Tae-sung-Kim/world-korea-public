'use client';

import ExportExcelButton from '@/app/admin/components/export-excel-button.component';
import OrderSearch from '@/app/admin/orders/order-search.component';
import OrderList from '@/app/components/orders/order-list.component';
import { useRef } from 'react';

export default function MyOrderClient() {
  const tableIdRef = useRef('userOrderExportExcelTable');

  return (
    <div className="content-search-container">
      <div className="list-search-buttons">
        <div className="flex-1 max-w-xl">
          <OrderSearch />
        </div>
        <div className="flex items-center gap-2">
          <ExportExcelButton
            tableId={tableIdRef.current}
            fileName="주문리스트"
          />
        </div>
      </div>
      <OrderList tableId={tableIdRef.current} isMy={true} />
    </div>
  );
}
