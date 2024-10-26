export type FunctionProps = {
  onSuccess?: () => void;
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
