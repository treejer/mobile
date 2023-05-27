import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {TUpdatedTreesRes} from 'webServices/trees/updatedTrees';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';

const UpdatedTrees = new ReduxFetchState<TUpdatedTreesRes, null, string>('updatedTrees');

export function* watchUpdatedTrees() {
  try {
    const res: FetchResult<TUpdatedTreesRes> = yield sagaFetch<TUpdatedTreesRes>('/update_requests/verification');
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
