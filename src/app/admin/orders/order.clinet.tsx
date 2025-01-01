'use client';

import ExportExcelButton from '../components/export-excel-button.component';
import QrCodeScanButton from '../components/qr-code-scan-button.component';
import OrderSearch from './order-search.component';
import OrderList from '@/app/components/orders/order-list.component';
import { useRef } from 'react';

export default function OrderClient() {
  const tableIdRef = useRef('orderExportExcelTable');

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
          <QrCodeScanButton onResiveData={() => {}} />
        </div>
      </div>
      <OrderList tableId={tableIdRef.current} />
    </div>
  );
}
