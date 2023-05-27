import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {TAssignedTreesRes} from 'webServices/trees/assignedTrees';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';

const AssignedTrees = new ReduxFetchState<TAssignedTreesRes, null, string>('assignedTrees');

export function* watchAssignedTrees() {
  try {
    const res: FetchResult<TAssignedTreesRes> = yield sagaFetch<TAssignedTreesRes>('/assigned_requests/verification');
    yield put(AssignedTrees.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(AssignedTrees.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* assignedTreesSagas() {
  yield takeEvery(AssignedTrees.actionTypes.load, watchAssignedTrees);
}

export const {
  reducer: assignedTreesReducer,
  actions: assignedTreesActions,
  actionTypes: assignedTreesActionTypes,
} = AssignedTrees;
