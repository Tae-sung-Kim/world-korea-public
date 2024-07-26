export interface IOnVerifyPassword {
  onVerifyPassword: (password: string) => void;
}

//0: detail, 1, passwordConfirm, 2: edit
export type StepType = 0 | 1 | 2;
