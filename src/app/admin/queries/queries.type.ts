export type FunctionProps = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export type PaginationProp = {
  pageNumber?: number;
  pageSize?: number;
  filter?: string;
};
