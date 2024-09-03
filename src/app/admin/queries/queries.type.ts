export type FunctionProps = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export type filterProp = Array<{
  key: string;
  value: string;
}>;

export type PaginationProp = {
  pageNumber?: number;
  pageSize?: number;
  filter?: filterProp;
};
