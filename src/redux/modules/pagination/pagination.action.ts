import {PaginationName, TAppQueries} from 'ranger-redux/modules/pagination/pagination.reducer';

export const SET_NEXT_PAGE = 'SET_NEXT_PAGE';
export const setNextPage = (name: PaginationName, query?: TAppQueries) => ({
  type: SET_NEXT_PAGE,
  name,
  query,
});

export const PAGINATION_REACHED_END = 'PAGINATION_REACHED_END';
export const paginationReachedEnd = (name: PaginationName) => ({
  type: PAGINATION_REACHED_END,
  name,
});

export const RESET_PAGINATION = 'RESET_PAGINATION';
export const resetPagination = (name: PaginationName) => ({
  type: RESET_PAGINATION,
  name,
});

export const SET_PAGINATION_TOTAL = 'SET_PAGINATION_TOTAL';
export const setPaginationTotal = (name: PaginationName, total: number) => ({
  type: SET_PAGINATION_TOTAL,
  name,
  total,
});
