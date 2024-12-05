'use client';

import { cn } from '@/lib/utils';
import React from 'react';

const ModalContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { useOverlayOpacity?: boolean }
>(({ className, children, ...props }, ref) => {
  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-200',
          props.useOverlayOpacity ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div className="fixed inset-0 z-10" onClick={props.onClick}>
        <div className="flex min-h-[100dvh] items-center justify-center p-3 sm:p-4">
          <div
            ref={ref}
            className={cn(
              'w-auto min-w-[280px] max-w-[95vw]',
              'bg-gray-100 dark:bg-gray-800 rounded-md sm:rounded-lg',
              'shadow-lg dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]',
              'max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-hidden',
              'transform transition-all duration-200',
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

ModalContainer.displayName = 'ModalContainer';

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'sticky top-0 z-20',
        'flex items-center justify-between',
        'px-3 py-2.5 sm:px-4 sm:py-3',
        'border-b border-gray-200/75 dark:border-gray-700/75',
        'bg-white dark:bg-gray-900',
        'shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]',
        className
      )}
    >
      {children}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'px-3 py-3 sm:px-4 sm:py-4',
        'bg-gray-100 dark:bg-gray-800',
        'text-gray-600 dark:text-gray-300',
        className
      )}
    >
      {children}
    </div>
  );
});

ModalContent.displayName = 'ModalContent';

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'sticky bottom-0 z-20',
        'flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2',
        'px-3 py-2.5 sm:px-4 sm:py-3',
        'border-t border-gray-200/75 dark:border-gray-700/75',
        'bg-white dark:bg-gray-900',
        'shadow-[0_-2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_4px_rgba(0,0,0,0.2)]',
        className
      )}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

export { ModalContainer, ModalHeader, ModalContent, ModalFooter };
