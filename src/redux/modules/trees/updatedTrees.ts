import ReduxFetchState from 'redux-fetch-state';
import {put, select, takeEvery} from 'redux-saga/effects';

import {TUpdatedTreesAction, TUpdatedTreesPayload, TUpdatedTreesRes} from 'webServices/trees/updatedTrees';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {PaginationName, TPaginationItem} from 'ranger-redux/modules/pagination/pagination.reducer';
import {getPaginationByName} from 'ranger-redux/modules/pagination/pagination.saga';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';

const UpdatedTrees = new ReduxFetchState<TUpdatedTreesRes, TUpdatedTreesPayload, string>('updatedTrees');

export function* watchUpdatedTrees({payload}: TUpdatedTreesAction) {
  try {
    const {filters, sort = {signer: -1, nonce: -1}} = payload || {};
    const {page, perPage}: TPaginationItem = yield select(getPaginationByName(PaginationName.UpdatedTrees));
    const res: FetchResult<TUpdatedTreesRes> = yield sagaFetch<TUpdatedTreesRes>('/update_requests/verification/me', {
      configUrl: 'treejerNestApiUrl',
      params: {
        limit: page * perPage,
        sort: sort ? JSON.stringify(sort) : undefined,
        filters: filters ? JSON.stringify(filters) : undefined,
      },
    });
    yield put(setPaginationTotal(PaginationName.UpdatedTrees, res.result.count));
    if (res.result.count === res.result.data.length) {
      yield put(paginationReachedEnd(PaginationName.UpdatedTrees));
    }
    yield put(UpdatedTrees.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(UpdatedTrees.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* updatedTreesSagas() {
  yield takeEvery(UpdatedTrees.actionTypes.load, watchUpdatedTrees);
}

export const {
  reducer: updatedTreesReducer,
  actions: updatedTreesActions,
  actionTypes: updatedTreesActionTypes,
} = UpdatedTrees;
