import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {pendingTreeIdsRes} from 'webServices/trees/pendingTreeIds';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';

export const PendingTreeIds = new ReduxFetchState<pendingTreeIdsRes, null, string>('pendingTreeIds');

export function* watchPendingTreeIds() {
  try {
    const updateRes: FetchResult<pendingTreeIdsRes> = yield sagaFetch<pendingTreeIdsRes>('/update_requests/me/ids');
    const assignedRes: FetchResult<pendingTreeIdsRes> = yield sagaFetch<pendingTreeIdsRes>('/assigned_requests/me/ids');
    yield put(PendingTreeIds.actions.loadSuccess([...updateRes.result, ...assignedRes.result]));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(PendingTreeIds.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* pendingTreeIdsSagas() {
  yield takeEvery(PendingTreeIds.actionTypes.load, watchPendingTreeIds);
}

export function usePendingTreeIds() {
  const {data: pendingTreeIds, ...pendingTreeIdsState} = useAppSelector(state => state.pendingTreeIds);
  const dispatch = useAppDispatch();

  const dispatchGetPendingTreeIds = useCallback(() => {
    dispatch(PendingTreeIds.actions.load());
  }, [dispatch]);

  const dispatchClearPendingTreeIds = useCallback(() => {
    dispatch(PendingTreeIds.actions.resetCache());
  }, [dispatch]);

  return {
    pendingTreeIds,
    ...pendingTreeIdsState,
    dispatchGetPendingTreeIds,
    dispatchClearPendingTreeIds,
  };
}

export const {
  reducer: pendingTreeIdsReducer,
  actions: pendingTreeIdsActions,
  actionTypes: pendingTreeIdsActionTypes,
} = PendingTreeIds;
