import { useState, useEffect } from 'react';

export type SortOrder = 'asc' | 'desc' | '';

interface UseSortProps<T> {
  data: T[];
  sortColumn: keyof T | string; // sortColumn을 문자열로 허용
  order: SortOrder;
}

function useSort<T>({ data, sortColumn, order }: UseSortProps<T>) {
  const [sortedData, setSortedData] = useState<T[]>([]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      if (order === '') {
        setSortedData(data);
      } else {
        const sorted = [...data].sort((a, b) => {
          const getValue = (item: T, path: string): any => {
            return path.split('.').reduce((obj: any, key: string) => {
              return obj && typeof obj === 'object' ? obj[key] : undefined; // obj가 객체일 경우만 접근
            }, item);
          };

          const aValue = getValue(a, sortColumn as string); // a의 해당 값
          const bValue = getValue(b, sortColumn as string); // b의 해당 값

          // undefined 처리 추가
          if (!aValue && !bValue) return 0; // 두 값 모두 undefined인 경우
          if (!aValue) return order === 'asc' ? 1 : -1; // aValue가 undefined일 경우
          if (!bValue) return order === 'asc' ? -1 : 1; // bValue가 undefined일 경우

          // 문자열과 숫자를 비교하기 위한 처리
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return order === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return order === 'asc' ? aValue - bValue : bValue - aValue;
          } else {
            // 두 값이 같을 경우
            return 0;
          }
        });

        setSortedData(sorted);
      }
    }
  }, [data, sortColumn, order]);

  return sortedData;
}

export default useSort;
