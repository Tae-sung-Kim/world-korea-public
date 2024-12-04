'use client';

import { Button } from '@/components/ui/button';
import {
  ModalContainer,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { IoClose } from 'react-icons/io5';
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  MouseEvent,
  cloneElement,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';

export const MODAL_TYPE = {
  ALERT: 'alert',
  CONFIRM: 'confirm',
  MODAL: 'modal', //사용자 정의
} as const;

type ModalType = (typeof MODAL_TYPE)[keyof typeof MODAL_TYPE];

type ModalComponentType = {
  id?: string;
  className?: string;
  title?: ReactNode | string;
  content?: ReactNode | string;
  okName?: string | undefined;
  cancelName?: string | undefined;
  showHeader?: boolean;
  showFooter?: boolean;
  useOverlayClose?: boolean;
  useOverlayOpacity?: boolean;
  useCloseButton?: boolean;
  useOkClose?: boolean;
  useCancelClose?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  onOverlayClick?: (e: MouseEvent) => void;
};

type ModalPropsType = {
  type?: ModalType;
  Component?: ({
    id,
    onOk,
    onCancel,
    onClose,
  }: Pick<
    ModalComponentType,
    'id' | 'onOk' | 'onCancel' | 'onClose'
  >) => ReactNode;
} & ModalComponentType;

type AsyncPropsType = {
  id: string;
  isOk?: boolean;
  isCancel?: boolean;
};

interface ModalContextProps {
  openModal: ({ type }: ModalPropsType) => ReactNode | Promise<AsyncPropsType>;
}

const ModalContext = createContext<ModalContextProps>({
  openModal: () => <></>,
});

function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalPropsType[]>([]);

  //창 닫기
  const closeModal = (id: string = '') => {
    setModals((prevModal) => prevModal.filter((f) => f.id !== id));
  };

  //일반 창
  const openModal = async ({
    type = MODAL_TYPE.MODAL,
    className,
    Component,
    title,
    content,
    okName,
    cancelName,
    useOverlayOpacity = true,
    useCloseButton = true,
    showFooter = true,
    showHeader = true,
    useOverlayClose = false,
    useOkClose = true,
    useCancelClose = true,
    onOk,
    onCancel,
    onClose,
    onOverlayClick,
  }: ModalPropsType): Promise<AsyncPropsType> => {
    return new Promise<AsyncPropsType>((resolve) => {
      const id = uuidv4();

      //확인
      const handleOk = () => {
        onOk && onOk();

        resolve({
          id,
          isOk: true,
        });

        if (useOkClose) {
          closeModal(id);
        }
      };
      //취소
      const handleCancel = () => {
        onCancel && onCancel();

        resolve({
          id,
          isCancel: true,
        });

        if (useCancelClose) {
          closeModal(id);
        }
      };

      const handleClose = () => {
        onClose && onClose();
      };

      //바깥영역 클릭시 닫기 처리
      const handlOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
          onOverlayClick && onOverlayClick(e);
          closeModal(id);
        }
      };

      setModals((prevModal) => {
        return [
          ...prevModal,
          {
            id,
            type,
            className,
            Component,
            title,
            content,
            okName,
            cancelName,
            useOverlayOpacity,
            useCloseButton,
            showFooter,
            showHeader,
            useOverlayClose,
            useOkClose,
            onOk: handleOk,
            onCancel: handleCancel,
            onClose: handleClose,
            onOverlayClick: handlOverlayClick,
          },
        ];
      });
    });
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
      }}
    >
      {modals.map(
        ({
          id,
          type,
          className,
          Component,
          title,
          content,
          okName,
          cancelName,
          useOverlayOpacity = true,
          useCloseButton,
          showFooter,
          showHeader,
          useOverlayClose,
          onOk,
          onCancel,
          onClose,
          onOverlayClick,
        }) => {
          return (
            <ModalPortal key={id}>
              <ModalContainer
                className={className}
                useOverlayOpacity={useOverlayOpacity}
                {...(useOverlayClose
                  ? { onClick: (e) => onOverlayClick && onOverlayClick(e) }
                  : {})}
              >
                <>
                  {showHeader && (
                    <ModalHeader>
                      {title}
                      {useCloseButton && (
                        <Button
                          className={cn(
                            'absolute right-4 top-4',
                            'p-2 h-8 w-8 rounded-full',
                            'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700',
                            'text-blue-600/80 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
                            'border border-gray-100 dark:border-gray-700',
                            'shadow-sm',
                            'transform transition-all duration-200 ease-in-out',
                            'focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
                          )}
                          onClick={() => {
                            onClose && onClose();
                            closeModal(id);
                          }}
                        >
                          <IoClose className="h-5 w-5" />
                        </Button>
                      )}
                    </ModalHeader>
                  )}
                  {type === MODAL_TYPE.MODAL && Component ? (
                    cloneElement(
                      <Component
                        id={id}
                        onOk={onOk}
                        onCancel={onCancel}
                        onClose={onClose}
                      />
                    )
                  ) : (
                    <ModalContent>{content}</ModalContent>
                  )}
                  {showFooter && (
                    <ModalFooter>
                      <div className="flex justify-end gap-3 px-6 py-4">
                        {type === MODAL_TYPE.CONFIRM && (
                          <Button
                            className={cn(
                              'px-4 py-2 min-w-[120px]',
                              'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
                              'text-gray-700 dark:text-gray-300',
                              'transition-colors duration-200',
                              'rounded-lg',
                              'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
                            )}
                            onClick={onCancel}
                          >
                            {cancelName ?? '취소'}
                          </Button>
                        )}
                        <Button
                          className={cn(
                            'px-4 py-2 min-w-[120px]',
                            'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
                            'text-white',
                            'transition-colors duration-200',
                            'rounded-lg',
                            'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
                          )}
                          onClick={onOk}
                        >
                          {okName ?? '확인'}
                        </Button>
                      </div>
                    </ModalFooter>
                  )}
                </>
              </ModalContainer>
            </ModalPortal>
          );
        }
      )}

      {children}
    </ModalContext.Provider>
  );
}

const ModalPortal = ({ children }: { children: ReactNode }) => {
  const [modalRootElement, setModalRootElement] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    let rootElement = document.getElementById('modal-root');

    if (!rootElement) {
      // 'modal-root'가 없는 경우 생성
      rootElement = document.createElement('div');
      rootElement.id = 'modal-root';
      document.body.appendChild(rootElement);
    }

    setModalRootElement(rootElement);

    return () => {
      // 모달이 사라질 때 모달 root를 삭제하고 싶다면 이 부분에서 추가
    };
  }, []);

  if (!modalRootElement) return null;

  return ReactDOM.createPortal(children, modalRootElement);
};

export function useModalContext() {
  return useContext<ModalContextProps>(ModalContext);
}

export default ModalProvider;
