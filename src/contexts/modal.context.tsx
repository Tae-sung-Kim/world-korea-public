'use client';

import { Button } from '@/components/ui/button';
import {
  ModalContainer,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  MouseEvent,
  cloneElement,
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
                          className="bg-red-400 rounded-full hover:bg-red-300 absolute top-0 right-0 h-7 w-7"
                          onClick={() => {
                            onClose && onClose();
                            closeModal(id);
                          }}
                        >
                          X
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
                      <div className="flex justify-center">
                        {type === MODAL_TYPE.CONFIRM && (
                          <Button
                            className="p-2 mx-5 bg-slate-400 hover:bg-slate-300 min-w-36"
                            onClick={onCancel}
                          >
                            {cancelName ?? '취소'}
                          </Button>
                        )}
                        <Button
                          className="p-2 mx-5 bg-blue-400 hover:bg-blue-300 min-w-36"
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
  let ModalRootElement = document.getElementById('modal-root');
  console.log('ModalRootElement 확인', ModalRootElement);
  if (!ModalRootElement) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div id="modal-root"></div>'
    );

    ModalRootElement = document.createElement('div');
    ModalRootElement.id = 'modal-root';
  }

  return ReactDOM.createPortal(children, ModalRootElement);
};

export function useModalContext() {
  return useContext<ModalContextProps>(ModalContext);
}

export default ModalProvider;
