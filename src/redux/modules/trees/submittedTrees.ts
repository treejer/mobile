import {useCallback, useEffect} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, select, takeEvery} from 'redux-saga/effects';

import {TSubmittedTreesRes} from 'webServices/trees/submittedTrees';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {getPaginationByName} from 'ranger-redux/modules/pagination/pagination.saga';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';
import {PaginationName, TPaginationItem, useReduxPagination} from 'ranger-redux/modules/pagination/pagination.reducer';
import {TReduxState} from 'ranger-redux/store';
import {getWallet} from 'ranger-redux/modules/web3/web3';

export const SubmittedTrees = new ReduxFetchState<TSubmittedTreesRes, null, string>('submittedTrees');

export function* watchSubmittedTrees() {
  try {
    const wallet = yield select(getWallet);
    const {page, perPage}: TPaginationItem = yield select(getPaginationByName(PaginationName.SubmittedTrees));
    const res: FetchResult<TSubmittedTreesRes> = yield sagaFetch<TSubmittedTreesRes>('/submitted/me', {
      configUrl: 'treejerNestApiUrl',
      params: {
        skip: page,
        limit: perPage,
        planterAddress: wallet.toLocaleLowerCase(),
      },
    });
    yield put(setPaginationTotal(PaginationName.SubmittedTrees, res.result.count));
    const persistedSubmittedTrees: TSubmittedTreesRes = yield select(getSubmittedTrees);
    if (res.result.count === [...(persistedSubmittedTrees?.data || []), ...res.result.data].length) {
      yield put(paginationReachedEnd(PaginationName.SubmittedTrees));
    }
    yield put(
      SubmittedTrees.actions.loadSuccess({
        ...res.result,
        data: [
          ...(page === 0 || !persistedSubmittedTrees?.data ? [] : persistedSubmittedTrees?.data),
          ...res.result.data,
        ],
      }),
    );
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(SubmittedTrees.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* submittedTreesSagas() {
  yield takeEvery(SubmittedTrees.actionTypes.load, watchSubmittedTrees);
}

export const getSubmittedTrees = (state: TReduxState) => state.submittedTrees.data;

export function useSubmittedTrees(fetchOnMount?: boolean) {
  const {data: submittedTrees, ...submittedTreesState} = useAppSelector(state => state.submittedTrees);
  const pagination = useReduxPagination(PaginationName.SubmittedTrees);
  const dispatch = useAppDispatch();

  const dispatchGetSubmittedTrees = useCallback(() => {
    dispatch(SubmittedTrees.actions.load());
  }, [dispatch]);

  useEffect(() => {
    if (fetchOnMount) {
      dispatchGetSubmittedTrees();
    }
  }, []);

  const dispatchRefetch = useCallback(() => {
    pagination.dispatchResetPagination();
    dispatchGetSubmittedTrees();
  }, [dispatchGetSubmittedTrees, pagination.dispatchResetPagination]);

  return {
    submittedTrees,
    ...submittedTreesState,
    refetching: !!submittedTrees?.data && submittedTreesState.loading,
    dispatchGetSubmittedTrees,
    dispatchRefetch,
    dispatchLoadMore: () => pagination.dispatchNextPage(SubmittedTrees.actions.load),
    pagination,
  };
}

export const {
  reducer: submittedTreesReducer,
  actions: submittedTreesActions,
  actionTypes: submittedTreesActionTypes,
} = SubmittedTrees;
