'use client';

import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function Loading() {
  const isFetching: boolean = !!useIsFetching();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isFetching) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex h-full items-center justify-center">
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <svg className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12"></svg>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm font-medium min-w-[80px] text-center">
            잠시만 기다려주세요{dots}
          </p>
        </div>
      </div>
    </div>
  );
}
