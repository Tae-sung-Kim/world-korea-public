import { useState } from 'react';

export type SortOrder = 'asc' | 'desc' | '';

export interface SortConfig {
  name: string;
  order: SortOrder;
}

export default function useSort(defaultSort?: SortConfig) {
  const [sortColumn, setSortColumn] = useState<string>(defaultSort?.name || '');
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    defaultSort?.order || ''
  );

  const handleSort = (column: string) => {
    const isPrevColumn = sortColumn !== column;

    if (isPrevColumn) {
      setSortColumn(column);
      setSortOrder('asc');
    } else {
      setSortOrder((prevOrder) =>
        prevOrder === '' ? 'asc' : prevOrder === 'asc' ? 'desc' : ''
      );
    }
  };

  return {
    handleSort,
    sort: {
      name: sortColumn,
      order: sortOrder,
    },
  };
}
