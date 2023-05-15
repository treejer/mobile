import ReduxFetchState from 'redux-fetch-state';
import {put, take, takeEvery} from 'redux-saga/effects';

import {TVerifyMobileAction, TVerifyMobilePayload, TVerifyMobileRes} from 'webServices/verification/verifyMobile';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {profileActions, profileActionsTypes} from 'ranger-redux/modules/profile/profile';

const VerifyMobile = new ReduxFetchState<TVerifyMobileRes, TVerifyMobilePayload, string>('verifyMobile');

export function* watchVerifyMobile({payload}: TVerifyMobileAction) {
  try {
    const {verifyMobileCode} = payload || {};
    const res: FetchResult<TVerifyMobileRes> = yield sagaFetch<TVerifyMobileRes, TVerifyMobilePayload>(
      '/mobile/verify',
      {
        configUrl: 'treejerNestApiUrl',
        method: 'POST',
        data: {
          verifyMobileCode,
        },
      },
    );
    yield put(profileActions.load());
    yield take(profileActionsTypes.loadSuccess);
    yield put(VerifyMobile.actions.loadSuccess(res.result));
    showSagaAlert({
      message: res.result,
      mode: AlertMode.Success,
    });
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(VerifyMobile.actions.loadFailure(Array.isArray(message) ? message[0] : message));
  }
}

export function* verifyMobileSagas() {
  yield takeEvery(VerifyMobile.actionTypes.load, watchVerifyMobile);
}

export const {
  reducer: verifyMobileReducer,
  actions: verifyMobileActions,
  actionTypes: verifyMobileActionTypes,
} = VerifyMobile;
