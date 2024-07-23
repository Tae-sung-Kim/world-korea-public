'use client';

import { cn } from '@/lib/utils';
import React from 'react';

//모달을 이런식으로 만들어야 하는지??
//아니면 div로 구성해야 하는지 -> useStaet, useEffect를 이용해야 하는지?

interface IPropsType extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void | undefined;
}

const Modal = React.forwardRef<HTMLDivElement, IPropsType>(
  ({ className, children, ...props }, ref) => {
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
              'min-w-96 min-h-96 bg-slate-200 space-y-4 border-2 border-indigo-600',
              className
            )}
          >
            {children}
          </div>
        </div>
      </>
    );
  }
);

Modal.displayName = 'Modal';

const ModalHeader = React.forwardRef<HTMLDivElement, IPropsType>(
  ({ className, children, onClose }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('border-b-2 border-indigo-600 p-4 min-w-40', className)}
      >
        <div className="relative">
          {children}
          {onClose && (
            <button
              className="bg-amber-100 rounded-full hover:bg-amber-300 absolute top-0 right-0 h-7 w-7"
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

const ModalContent = React.forwardRef<HTMLDivElement, IPropsType>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-5 min-w-96 min-h-96', className)}>
        {children}
      </div>
    );
  }
);

ModalContent.displayName = 'ModalContent';

const ModalFooter = React.forwardRef<HTMLDivElement, IPropsType>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('border-t-2 border-indigo-600 p-4 min-w-40', className)}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalContent, ModalFooter };
