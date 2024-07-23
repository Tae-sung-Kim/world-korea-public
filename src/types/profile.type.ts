export interface IOnVerifyPassword {
  onVerifyPassword: (password: string) => void;
}

export interface IModalFunction {
  onClose?: () => void | undefined;
}
