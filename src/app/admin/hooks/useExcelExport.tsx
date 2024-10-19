import { useCallback } from 'react';
import { utils, writeFile } from 'xlsx';

type ExportExcel = {
  tableId: string;
  fileName: string;
  excludeClassName: string;
};

const useExcelExport = () => {
  const exportToExcel = useCallback(
    ({ tableId, fileName, excludeClassName }: ExportExcel) => {
      const table = document.getElementById(tableId);

      if (table) {
        // 테이블 복사본 생성
        const clonedTable = table.cloneNode(true) as HTMLElement;

        // 무조건 tfoot 제거
        const tfoot = clonedTable.querySelector('tfoot');
        if (tfoot) {
          tfoot.remove();
        }

        // 제외할 td, th 요소 선택
        if (excludeClassName) {
          // td 요소 삭제
          const excludeTDs = clonedTable.querySelectorAll(
            `td.${excludeClassName}`
          );
          excludeTDs.forEach((el) => el.remove());

          // th 요소 삭제
          const excludeTHs = clonedTable.querySelectorAll(
            `th.${excludeClassName}`
          );
          excludeTHs.forEach((el) => el.remove());
        }

        // 클론된 테이블 데이터를 엑셀로 변환
        const wb = utils.table_to_book(clonedTable);
        writeFile(wb, (fileName ?? new Date().toISOString()) + '.xlsx'); // 파일 저장
      }
    },
    []
  );

  return exportToExcel;
};

export default useExcelExport;
