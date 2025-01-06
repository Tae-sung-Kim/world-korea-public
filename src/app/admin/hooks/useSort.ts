import { useState } from 'react';

export type SortOrder = 'asc' | 'desc' | '';

export default function useSort() {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');

  return {
    sortColumn,
    sortOrder,
    setSortColumn,
    setSortOrder,
  };
}
