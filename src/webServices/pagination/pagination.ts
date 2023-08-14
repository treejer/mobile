export type PaginationRes<T> = {
  data: T[];
  count?: number;
  hasMore?: boolean;
};
