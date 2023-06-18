import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {TUpdateTreeAction, TUpdateTreePayload, TUpdateTreeRes} from 'webServices/submitTreeEvents/updateTree';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {updatedTreesActions} from 'ranger-redux/modules/trees/updatedTrees';

const UpdateTree = new ReduxFetchState<TUpdateTreeRes, TUpdateTreePayload, string | string[]>('updateTree');

export function* watchUpdateTree({payload}: TUpdateTreeAction) {
  try {
    const {treeId, treeSpecs, signature} = payload || {};
    const res: FetchResult<TUpdateTreeRes> = yield sagaFetch<TUpdateTreeRes, TUpdateTreePayload>('/update_requests', {
      configUrl: 'treejerNestApiUrl',
      method: 'POST',
      data: {
        treeId,
        treeSpecs,
        signature,
      },
    });
    yield put(updatedTreesActions.load());
    yield put(UpdateTree.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(UpdateTree.actions.loadFailure(message));
    yield put(setSubmitJourneyLoading(false));
    yield handleSagaFetchError(e, {logoutUnauthorized: false});
  }
}

export function* updateTreeSagas() {
  yield takeEvery(UpdateTree.actionTypes.load, watchUpdateTree);
}

export const {reducer: updateTreeReducer, actions: updateTreeActions, actionTypes: updateTreeActionTypes} = UpdateTree;