import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {plantedTreesActions} from 'ranger-redux/modules/trees/plantedTrees';
import {updatedTreesActions} from 'ranger-redux/modules/trees/updatedTrees';
import {assignedTreesActions} from 'ranger-redux/modules/trees/assignedTrees';
import * as actionsList from './pagination.action';

export type TAppQueries = {
  sort?: {signer: number; nonce: number};
  filters?: {signer: string; nonce: number};
};

export enum PaginationName {
  PlantedTrees,
  UpdatedTrees,
  AssignedTrees,
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
  page: 1,
  perPage: 20,
  total: 0,
  hasMore: true,
  loading: false,
};

export const paginationInitialState: TPaginationState = {
  [PaginationName.PlantedTrees]: defaultPaginationItem,
  [PaginationName.UpdatedTrees]: defaultPaginationItem,
  [PaginationName.AssignedTrees]: defaultPaginationItem,
};

export type TPaginationAction = {
  type: string;
  name: PaginationName;
  total?: number;
  page?: number;
  query?: TAppQueries;
};

export function paginationReducer(state: TPaginationState = paginationInitialState, action: TPaginationAction) {
  switch (action.type) {
    case actionsList.SET_NEXT_PAGE:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          page: state[action.name].page + 1,
        },
      };
    case actionsList.SET_PAGINATION_TOTAL:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          total: action.total,
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

export const PaginationNameFetcher = {
  [PaginationName.PlantedTrees]: plantedTreesActions.load,
  [PaginationName.UpdatedTrees]: updatedTreesActions.load,
  [PaginationName.AssignedTrees]: assignedTreesActions.load,
};

export type TUsePagination = TPaginationItem & {
  dispatchNextPage: (query?: TAppQueries) => void;
  dispatchResetPagination: () => void;
};

export function usePagination(name: PaginationName): TUsePagination {
  const data = useAppSelector(state => state.pagination[name]);

  const dispatch = useAppDispatch();

  const dispatchNextPage = useCallback(
    (query?: TAppQueries) => {
      dispatch(actionsList.setNextPage(name, query));
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
