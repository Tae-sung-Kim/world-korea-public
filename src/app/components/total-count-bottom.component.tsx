'use client';

import { addComma } from '@/utils/number';

interface TotalCountBottomProps {
  title?: string;
  count: number;
  unit?: string;
}

export default function TotalCountBottom({
  title = '총 구매',
  count,
  unit = '개',
}: TotalCountBottomProps) {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-lg shadow-sm px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-0.5 bg-primary/80 rounded-full"></div>
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-base font-semibold text-gray-900">
            {addComma(count)}
          </span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>
    </div>
  );
}
