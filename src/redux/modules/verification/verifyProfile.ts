import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {TVerifyProfileAction, TVerifyProfilePayload} from 'webServices/verification/verifyProfile';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';

const VerifyProfile = new ReduxFetchState<any, TVerifyProfilePayload, string | string[]>('verifyProfile');
export function* watchVerifyProfile({payload}: TVerifyProfileAction) {
  try {
    const res: FetchResult<any> = yield sagaFetch<any, TVerifyProfilePayload>('/application', {
      configUrl: 'treejerNestApiUrl',
      method: 'POST',
      data: payload,
    });
    yield put(VerifyProfile.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(VerifyProfile.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* verifyProfileSagas() {
  yield takeEvery(VerifyProfile.actionTypes.load, watchVerifyProfile);
}

export const {
  reducer: verifyProfileReducer,
  actions: verifyProfileActions,
  actionTypes: verifyProfileActionTypes,
} = VerifyProfile;
