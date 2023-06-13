import ReduxFetchState from 'redux-fetch-state';
import {put, select, takeEvery} from 'redux-saga/effects';

import {TUpdatedTreesAction, TUpdatedTreesPayload, TUpdatedTreesRes} from 'webServices/trees/updatedTrees';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {PaginationName, TPaginationItem} from 'ranger-redux/modules/pagination/pagination.reducer';
import {getPaginationByName} from 'ranger-redux/modules/pagination/pagination.saga';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';
import {TReduxState} from 'ranger-redux/store';

const UpdatedTrees = new ReduxFetchState<TUpdatedTreesRes, TUpdatedTreesPayload, string>('updatedTrees');

export function* watchUpdatedTrees({payload}: TUpdatedTreesAction) {
  try {
    const {filters, sort = {signer: -1, nonce: -1}} = payload || {};
    const {page, perPage}: TPaginationItem = yield select(getPaginationByName(PaginationName.UpdatedTrees));
    const res: FetchResult<TUpdatedTreesRes> = yield sagaFetch<TUpdatedTreesRes>('/update_requests/verification/me', {
      configUrl: 'treejerNestApiUrl',
      params: {
        skip: page,
        limit: perPage,
        sort: sort ? JSON.stringify(sort) : undefined,
        filters: filters ? JSON.stringify(filters) : undefined,
      },
    });
    if (res?.result?.count) {
      yield put(setPaginationTotal(PaginationName.UpdatedTrees, res.result.count));
    }
    const persistedUpdatedTrees: TUpdatedTreesRes = yield select(getUpdatedTrees);
    if (res.result.count === [...(persistedUpdatedTrees?.data || []), ...res.result.data].length) {
      yield put(paginationReachedEnd(PaginationName.UpdatedTrees));
    }
    yield put(
      UpdatedTrees.actions.loadSuccess({
        count: res.result.count,
        data: [...(page === 0 || !persistedUpdatedTrees?.data ? [] : persistedUpdatedTrees?.data), ...res.result.data],
      }),
    );
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(UpdatedTrees.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* updatedTreesSagas() {
  yield takeEvery(UpdatedTrees.actionTypes.load, watchUpdatedTrees);
}

export const getUpdatedTrees = (state: TReduxState) => state.updatedTrees.data;

export const {
  reducer: updatedTreesReducer,
  actions: updatedTreesActions,
  actionTypes: updatedTreesActionTypes,
} = UpdatedTrees;
