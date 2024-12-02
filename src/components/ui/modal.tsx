'use client';

import { cn } from '@/lib/utils';
import React from 'react';

const ModalContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { useOverlayOpacity?: boolean }
>(({ className, children, ...props }, ref) => {
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black',
          props.useOverlayOpacity ? 'opacity-50' : 'opacity-0'
        )}
      />

      {/* Modal Wrapper */}
      <div 
        className="fixed inset-0 z-10"
        onClick={props.onClick}
      >
        <div className="relative flex min-h-[100dvh] items-center justify-center p-4">
          {/* Modal Content */}
          <div
            ref={ref}
            className={cn(
              'w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl',
              'max-w-[calc(100vw-2rem)] sm:max-w-[520px] md:max-w-[600px]',
              'max-h-[calc(100dvh-2rem)] overflow-auto',
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
        'flex items-center px-4 py-3 sm:px-6',
        'border-b border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800',
        className
      )}
    >
      <div className="flex-1 text-base font-semibold">
        {children}
      </div>
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative',
        'p-4 sm:p-6',
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
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'sticky bottom-0 z-20',
        'flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3',
        'border-t border-gray-200 dark:border-gray-700',
        'p-4 sm:p-6 bg-white dark:bg-gray-800',
        className
      )}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

export { ModalContainer, ModalHeader, ModalContent, ModalFooter };
