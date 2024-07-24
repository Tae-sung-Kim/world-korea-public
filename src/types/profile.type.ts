export interface IOnVerifyPassword {
  onVerifyPassword: (password: string) => void;
}

export interface ModalFunction {
  onClose?: () => void | undefined;
}
