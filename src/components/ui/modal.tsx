'use client';

import { cn } from '@/lib/utils';
import React from 'react';

const ModalContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <>
      {/* modal backgroundStyle */}
      <div
        className={cn('top-0 w-full h-full fixed bg-stone-100 opacity-70')}
      ></div>

      <div
        className={cn(
          'top-0 w-full h-full fixed z-10 p-10 flex justify-center grid content-center'
        )}
        onClick={props.onClick}
      >
        <div
          ref={ref}
          className={cn(
            'min-w-96 min-h-60 bg-gray-50 space-y-4 border-2 border-double border-indigo-600',
            className
          )}
        >
          {children}
        </div>
      </div>
    </>
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
        'border-b-2 border-dotted border-indigo-600 p-4 min-h-14',
        className
      )}
    >
      <div className="relative">{children}</div>
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('p-5 min-h-64', className)}>
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
        'border-t-2 border-dotted border-indigo-600 p-2 min-h-14',
        className
      )}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

export { ModalContainer, ModalHeader, ModalContent, ModalFooter };
