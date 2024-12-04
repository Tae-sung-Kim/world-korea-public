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
          'fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          props.useOverlayOpacity ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Modal Wrapper */}
      <div className="fixed inset-0 z-10" onClick={props.onClick}>
        <div className="relative flex min-h-[100dvh] items-center justify-center p-4">
          {/* Modal Content */}
          <div
            ref={ref}
            className={cn(
              'w-full mx-auto bg-white dark:bg-gray-900 rounded-xl',
              'shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]',
              'transform transition-all duration-300 ease-out',
              'max-w-[90vw] sm:max-w-[520px] md:max-w-[600px]',
              'max-h-[calc(100dvh-2rem)] overflow-auto',
              'scale-100 opacity-100',
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
        'flex items-center px-5 py-4 sm:px-6',
        'border-b border-gray-100 dark:border-gray-800',
        'bg-white dark:bg-gray-900',
        className
      )}
    >
      <div className="flex-1 text-lg font-semibold text-gray-900 dark:text-white">
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
        'px-5 py-4 sm:p-6',
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
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'sticky bottom-0 z-20',
        'flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3',
        'px-5 py-4 sm:px-6',
        'border-t border-gray-100 dark:border-gray-800',
        'bg-white dark:bg-gray-900',
        className
      )}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

export { ModalContainer, ModalHeader, ModalContent, ModalFooter };
