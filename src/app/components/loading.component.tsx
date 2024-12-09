'use client';

import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

/**
 * 
 * 
 * 
// 기본 사용 (전체 화면)
<Loading />

// 커스텀 메시지
<Loading message="데이터를 불러오는 중" />

// 작은 크기의 인라인 로딩
<Loading fullScreen={false} size="sm" message={false} />

// 특정 컨테이너 내부에서 사용
<div className="relative h-[200px]">
  <Loading fullScreen={false} size="lg" />
</div>
*/

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Loading({
  message = '잠시만 기다려주세요',
  fullScreen = true,
  size = 'md',
  className = '',
}: LoadingProps) {
  const isFetching: boolean = !!useIsFetching();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isFetching) {
    return null;
  }

  const spinnerSizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const containerStyles = fullScreen
    ? 'fixed inset-0 z-50'
    : 'relative w-full h-full min-h-[100px]';

  const overlayStyles = fullScreen
    ? 'absolute inset-0 bg-black/50'
    : 'absolute inset-0 bg-white/80 dark:bg-gray-800/80';

  return (
    <div className={`${containerStyles} ${className}`}>
      <div className={overlayStyles} />
      <div className="relative flex h-full items-center justify-center">
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <svg
            className={`animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 ${spinnerSizes[size]}`}
          />
          {message && (
            <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm font-medium min-w-[80px] text-center">
              {message}
              {dots}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
