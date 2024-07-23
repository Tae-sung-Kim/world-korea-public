'use client';

import { cn } from '@/lib/utils';
import { IModalFunction } from '@/types';
import React from 'react';

//모달을 이런식으로 만들어야 하는지??
//아니면 div로 구성해야 하는지 -> useStaet, useEffect를 이용해야 하는지?

interface IModalProps
  extends IModalFunction,
    React.HTMLAttributes<HTMLDivElement> {
  // 추가적인 props 정의
}

const Modal = React.forwardRef<
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
      >
        {/* 드래그 할려면 여기서 해야함. */}
        <div
          ref={ref}
          className={cn(
            'min-w-96 min-h-96 bg-gray-50 space-y-4 border-2 border-double border-indigo-600',
            className
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
});

Modal.displayName = 'Modal';

const ModalHeader = React.forwardRef<HTMLDivElement, IModalProps>(
  ({ className, children, onClose }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border-b-2 border-dotted border-indigo-600 p-4 min-w-40',
          className
        )}
      >
        <div className="relative">
          {children}
          {onClose && (
            <button
              className="bg-slate-200 rounded-full hover:bg-slate-400 absolute top-0 right-0 h-7 w-7"
              onClick={onClose}
            >
              X
            </button>
          )}
        </div>
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('p-5 min-w-96 min-h-96', className)}>
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
        'border-t-2 border-dotted border-indigo-600 p-4 min-w-40',
        className
      )}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalContent, ModalFooter };
