import { ReactNode, useState } from 'react';
import { Modal } from '../../components/modal/modal';
import { ModalContext, ModalInitProps } from './modal.context';

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [modalProps, setModalProps] = useState<ModalInitProps>();
  const open1 = (props: ModalInitProps) => {
    setModalProps(props);
    setIsOpen1(true);
  };

  const open2 = (props: ModalInitProps) => {
    setModalProps(props);
    setIsOpen2(true);
  };

  const close = () => {
    setIsOpen1(false);
    setIsOpen2(false);
  };

  return (
    <ModalContext.Provider
      value={{
        open1,
        open2,
        close,
      }}
    >
      <Modal open={isOpen1} title={modalProps?.title} level={0} onClose={() => close()}>
        {modalProps?.children}
      </Modal>
      <Modal open={isOpen2} title={modalProps?.title} level={0} onClose={() => close()}>
        {modalProps?.children}
      </Modal>
      {children}
    </ModalContext.Provider>
  );
};
