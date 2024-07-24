'use client';

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
  title?: ReactNode | string;
  content?: ReactNode | string;
  okName?: string | undefined;
  cancelName?: string | undefined;
  showHeader?: boolean;
  showFooter?: boolean;
  useOverlayClose?: boolean;
  useCloseButton?: boolean;
  useOkClose?: boolean;
  useCancelClose?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onOverlayClick?: (e: MouseEvent) => void;
};

type ModalPropsType = {
  type?: ModalType;
  component?: ReactNode | null | undefined;
} & ModalComponentType;

interface ModalContextProps {
  openModal: ({ type }: ModalPropsType) => void;
  closeModal?: (id: string) => void;
}

const ModalContext = createContext<ModalContextProps>({
  openModal: () => <></>,
  closeModal: undefined,
});

function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalPropsType[]>([]);

  //경고창
  const openAlert = () => {
    console.log('openAlert');
  };

  //확인창
  const openConfirm = () => {
    console.log('openConfirm');
  };

  //창 닫기
  const closeModal = (id: string = '') => {
    setModals((prevModal) => prevModal.filter((f) => f.id !== id));
  };

  //일반 창
  const openModal = ({
    type = MODAL_TYPE.MODAL,
    component,
    title,
    content,
    okName,
    cancelName,
    useCloseButton = true,
    showFooter = true,
    showHeader = true,
    useOverlayClose = false,
    useOkClose = true,
    useCancelClose = true,
    onOk,
    onCancel,
    onOverlayClick,
  }: ModalPropsType) => {
    const id = uuidv4();

    //확인
    const handleOk = () => {
      onOk && onOk();

      if (useOkClose) {
        closeModal(id);
      }
    };
    //취소
    const handleCancel = () => {
      onCancel && onCancel();

      closeModal(id);
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
          component,
          title,
          content,
          okName,
          cancelName,
          useCloseButton,
          showFooter,
          showHeader,
          useOverlayClose,
          useOkClose,
          onOk: handleOk,
          onCancel: handleCancel,
          onOverlayClick: handlOverlayClick,
        },
      ];
    });

    if (type === MODAL_TYPE.ALERT) {
      console.log('alert');
    } else if (type === MODAL_TYPE.CONFIRM) {
      console.log('confirm');
    } else {
      console.log('modal');
    }
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {modals.map(
        ({
          id,
          type,
          component,
          title,
          content,
          okName,
          cancelName,
          useCloseButton,
          showFooter,
          showHeader,
          useOverlayClose,
          onOk,
          onCancel,
          onOverlayClick,
        }) => {
          return (
            <ModalPortal key={id}>
              {type === MODAL_TYPE.MODAL && component ? (
                <>{component && 'componet 있음'}</>
              ) : (
                <ModalContainer
                  {...(useOverlayClose
                    ? { onClick: (e) => onOverlayClick && onOverlayClick(e) }
                    : {})}
                >
                  {showHeader && (
                    <ModalHeader>
                      <>
                        {title}
                        {useCloseButton && (
                          <button
                            className="bg-slate-200 rounded-full hover:bg-slate-400 absolute top-0 right-0 h-7 w-7"
                            onClick={() => closeModal(id)}
                          >
                            X
                          </button>
                        )}
                      </>
                    </ModalHeader>
                  )}
                  <ModalContent>{content}</ModalContent>
                  {showFooter && (
                    <ModalFooter>
                      <div className="grid grid-cols-2 gap-4">
                        {type === MODAL_TYPE.CONFIRM && <button>취소</button>}
                        <button
                          className="p-2 bg-slate-200 hover:bg-slate-400"
                          onClick={onCancel}
                        >
                          {cancelName ?? '취소'}
                        </button>
                        <button
                          className="p-2 bg-teal-200 hover:bg-teal-400"
                          onClick={onOk}
                        >
                          {okName ?? '확인'}
                        </button>
                      </div>
                    </ModalFooter>
                  )}
                </ModalContainer>
              )}
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
