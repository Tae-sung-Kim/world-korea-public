export type FunctionProps<T = string> = {
  onSuccess?: (data?: T) => void;
  onError?: () => void;
  onSettled?: () => void;
};

export type PaginationProp<T> = {
  pageNumber?: number;
  pageSize?: number;
  filter?: T;
};

export type PageFilter = { [key: string]: string };

export interface ErrorResponse {
  message: string;
}
