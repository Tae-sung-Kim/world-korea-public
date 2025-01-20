import React from 'react';
import { FiInbox } from 'react-icons/fi';

interface NoDataFoundProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function NoDataFound({
  message = '검색 결과가 없습니다.',
  className,
  children,
}: NoDataFoundProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full p-8 ${className}`}
    >
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <FiInbox className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 text-lg font-medium">
        {children ? children : message}
      </p>
    </div>
  );
}
