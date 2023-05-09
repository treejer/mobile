import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {TVerifyMobileAction, TVerifyMobilePayload, TVerifyMobileRes} from 'webServices/verification/verifyMobile';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';

const VerifyMobile = new ReduxFetchState<TVerifyMobileRes, TVerifyMobilePayload, string | string[]>('verifyMobile');

export function* watchVerifyMobile({payload}: TVerifyMobileAction) {
  try {
    const {verificationCode} = payload || {};
    const res: FetchResult<TVerifyMobileRes> = yield sagaFetch<TVerifyMobileRes, TVerifyMobilePayload>(
      '/mobile/verify',
      {
        configUrl: 'treejerNestApiUrl',
        method: 'POST',
        data: {
          verificationCode,
        },
      },
    );
    yield put(VerifyMobile.actions.loadSuccess(res.result));
    showSagaAlert({
      message: res.result.message,
      mode: AlertMode.Success,
    });
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(VerifyMobile.actions.loadFailure(message));
    yield handleSagaFetchError(e);
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
