'use client';

import { useIsFetching } from '@tanstack/react-query';

export default function Loading() {
  const isFetching: boolean = !!useIsFetching();

  if (!isFetching) {
    return null;
  }

  return (
    <div className="absolute w-full h-full grid place-items-center z-10">
      <svg className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12"></svg>
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );
}
