import { createContext, ReactNode, useContext } from 'react';

export type ModalInitProps = {
  title?: string;
  children: ReactNode;
};

export type ModalContextProps = {
  open1: (props: ModalInitProps) => void;
  open2: (props: ModalInitProps) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextProps>({
  open1: () => {},
  open2: () => {},
  close: () => {},
});

export const useModal = () => useContext(ModalContext);
