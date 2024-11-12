'use client';

import ExportExcelButton from '../components/export-excel-button.component';
import QrCodeScanButton from '../components/qr-code-scan-button.component';
import OrderSearch from './order-search.component';
import OrderList from '@/app/components/orders/order-list.components';
import { useRef } from 'react';

export default function OrderClient() {
  const tableIdRef = useRef('orderExportExcelTable');

  return (
    <>
      <div className="flex">
        <OrderSearch />
        <ExportExcelButton tableId={tableIdRef.current} fileName="test" />
        <QrCodeScanButton onResiveData={() => {}} />
      </div>
      <OrderList tableId={tableIdRef.current} />
    </>
  );
}
