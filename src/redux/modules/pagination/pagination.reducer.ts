import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import * as actionsList from './pagination.action';

export type TAppQueries = {
  sort?: {signer: number; nonce: number};
  filters?: {signer: string; nonce: number};
};

export enum PaginationName {
  PlantedTrees, // planted trees means not verified planted trees
  UpdatedTrees, // updated trees means not verified updated trees
  AssignedTrees, // assigned trees means not verified assigned trees
  SubmittedTrees, // submitted trees means verified trees by admin
}

export type TPaginationItem = {
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
};

export type TPaginationState = {
  [key in PaginationName]: TPaginationItem;
};

export const defaultPaginationItem: TPaginationItem = {
  page: 0,
  perPage: 20,
  total: 0,
  hasMore: true,
  loading: false,
};

export const paginationInitialState: TPaginationState = {
  [PaginationName.PlantedTrees]: defaultPaginationItem,
  [PaginationName.UpdatedTrees]: defaultPaginationItem,
  [PaginationName.AssignedTrees]: defaultPaginationItem,
  [PaginationName.SubmittedTrees]: defaultPaginationItem,
};

export type TPaginationAction = {
  type: string;
  name: PaginationName;
  total?: number;
  page?: number;
  query?: TAppQueries;
  action?: (query?: TAppQueries) => any;
};

export function paginationReducer(state: TPaginationState = paginationInitialState, action: TPaginationAction) {
  switch (action.type) {
    case actionsList.SET_NEXT_PAGE:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          page: state[action.name].page + 1,
          loading: true,
        },
      };
    case actionsList.SET_PAGINATION_TOTAL:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          total: action.total,
          loading: false,
        },
      };
    case actionsList.PAGINATION_REACHED_END:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          hasMore: false,
        },
      };
    case actionsList.RESET_PAGINATION:
      return {
        ...state,
        [action.name]: defaultPaginationItem,
      };
    default:
      return state;
  }
}

export type TUsePagination = TPaginationItem & {
  dispatchNextPage: (action: () => any, query?: TAppQueries) => void;
  dispatchResetPagination: () => void;
};

export function useReduxPagination(name: PaginationName): TUsePagination {
  const data = useAppSelector(state => state.pagination[name]);

  const dispatch = useAppDispatch();

  const dispatchNextPage = useCallback(
    (action: () => any, query?: TAppQueries) => {
      dispatch(actionsList.setNextPage(name, action, query));
    },
    [dispatch, name],
  );

  const dispatchResetPagination = useCallback(() => {
    dispatch(actionsList.resetPagination(name));
  }, [dispatch, name]);

  return {
    ...data,
    dispatchNextPage,
    dispatchResetPagination,
  };
}
