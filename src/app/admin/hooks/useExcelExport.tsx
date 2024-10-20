import { useCallback } from 'react';
import { utils, writeFile } from 'xlsx';

interface CellStyle {
  width?: number; // width는 픽셀 값으로 설정
  backgroundColor?: string;
  color?: string;
  fontWeight?: string;
  textAlign?: string;
}

interface Cell {
  value: string | null; // 셀 값은 문자열 또는 null일 수 있음
  style?: CellStyle; // 셀 스타일
}

type ExportExcel = {
  tableId: string;
  fileName: string;
};

const useExcelExport = () => {
  const exportToExcel = useCallback(({ tableId, fileName }: ExportExcel) => {
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
      const excludeElements = clonedTable.querySelectorAll(
        `[data-exclude-excel], th:empty, td:empty, td:has(button), th:has(button)`
      );

      excludeElements.forEach((el) => el.remove());

      // 클론된 테이블의 스타일을 적용하기 위한 배열 생성
      const data: Cell[][] = [];
      const columnWidths: number[] = []; // 열 너비를 저장할 배열

      clonedTable.querySelectorAll('tr').forEach((row) => {
        const rowData: Cell[] = [];
        row.querySelectorAll('th, td').forEach((cell, cellIndex) => {
          const cellValue = cell.textContent;

          // Tailwind 클래스를 검사하여 너비를 가져오기
          const widthClass = Array.from(cell.classList).find((cls) =>
            cls.startsWith('w-')
          );
          let width = 200; //default 설정

          if (widthClass) {
            const match = widthClass.match(/w-\[(\d+)px\]/);
            if (match) {
              width = parseInt(match[1], 10); // px 값으로 변환
            }
          }

          const getComputedStyleCell = getComputedStyle(cell);

          rowData.push({
            value: cellValue,
            style: {
              width: width, // Tailwind에서 가져온 너비
              backgroundColor: getComputedStyleCell.backgroundColor, // 배경색 가져오기
              color: getComputedStyleCell.color, // 글자색 가져오기
              fontWeight: getComputedStyleCell.fontWeight, // 글자 두께
              textAlign: getComputedStyleCell.textAlign, // 정렬
            },
          });

          // 열 너비를 업데이트
          if (width !== undefined) {
            if (
              columnWidths[cellIndex] === undefined ||
              columnWidths[cellIndex] < width
            ) {
              columnWidths[cellIndex] = width; // 최대 너비 저장
            }
          }
        });
        data.push(rowData);
      });

      // 새로운 워크북 생성
      const wb = utils.book_new();

      // 엑셀 시트 생성
      const ws = utils.aoa_to_sheet(
        data.map((row) => row.map((cell) => cell.value))
      );

      // 스타일을 적용
      data.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell.style) {
            const cellRef = utils.encode_cell({ c: cellIndex, r: rowIndex });
            ws[cellRef].s = {
              fill: {
                fgColor: { rgb: cell.style.backgroundColor?.slice(1) }, // RGB 값으로 변환
              },
              font: {
                color: { rgb: cell.style.color?.slice(1) }, // RGB 값으로 변환
                bold: cell.style.fontWeight === 'bold',
              },
              alignment: {
                horizontal: cell.style.textAlign,
              },
            };
          }
        });
      });

      // 열 너비 설정
      ws['!cols'] = columnWidths.map((width) => ({ wpx: width })); // px 단위로 설정

      // 시트 추가
      utils.book_append_sheet(wb, ws, 'Sheet1');

      // 파일 저장
      writeFile(wb, (fileName ?? new Date().toISOString()) + '.xlsx');
    }
  }, []);

  return exportToExcel;
};

export default useExcelExport;
