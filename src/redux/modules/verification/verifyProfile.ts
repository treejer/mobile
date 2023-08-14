import ReduxFetchState from 'redux-fetch-state';
import {put, take, takeEvery} from 'redux-saga/effects';

import {TVerifyProfileAction, TVerifyProfilePayload} from 'webServices/verification/verifyProfile';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {profileActions, profileActionsTypes} from 'ranger-redux/modules/profile/profile';
import {navigationRef} from 'navigation/navigationRef';
import {Routes} from 'navigation/Navigation';

const VerifyProfile = new ReduxFetchState<any, TVerifyProfilePayload, string>('verifyProfile');
export function* watchVerifyProfile({payload}: TVerifyProfileAction) {
  try {
    const res: FetchResult<any> = yield sagaFetch<any, TVerifyProfilePayload>('/application', {
      configUrl: 'treejerNestApiUrl',
      method: 'POST',
      headers: {'Content-Type': 'multipart/form-data'},
      data: payload,
    });
    yield put(profileActions.load());
    yield take(profileActionsTypes.loadSuccess);
    yield put(VerifyProfile.actions.loadSuccess(res.result));
    // @ts-ignore
    navigationRef()?.navigate(Routes.VerifyPending);
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(VerifyProfile.actions.loadFailure(Array.isArray(message) ? message[0] : message));
    yield handleSagaFetchError(e, {logoutUnauthorized: false});
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
