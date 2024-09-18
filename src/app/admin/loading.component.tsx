'use client';

import { useIsFetching } from '@tanstack/react-query';

export default function Loading() {
  const isFetching: boolean = !!useIsFetching();

  if (!isFetching) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <svg className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12"></svg>
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );
}
