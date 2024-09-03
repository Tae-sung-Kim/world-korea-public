export type FunctionProps = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export type PaginationProp<T extends string> = {
  pageNumber?: number;
  pageSize?: number;
  filter?: { [key in T]: string };
};
