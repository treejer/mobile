import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {TMobileResendCodeRes} from 'webServices/verification/mobileResendCode';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';

const MobileResendCode = new ReduxFetchState<TMobileResendCodeRes, undefined, string>('mobileResendCode');

export function* watchMobileResendCode() {
  try {
    const res: FetchResult<TMobileResendCodeRes> = yield sagaFetch<TMobileResendCodeRes>('/mobile/resend', {
      configUrl: 'treejerNestApiUrl',
      method: 'POST',
    });
    yield put(MobileResendCode.actions.loadSuccess(res.result));
    showSagaAlert({
      message: res.result,
      mode: AlertMode.Success,
    });
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(MobileResendCode.actions.loadFailure(Array.isArray(message) ? message[0] : message));
    yield handleSagaFetchError(e);
  }
}

export function* mobileResendCodeSagas() {
  yield takeEvery(MobileResendCode.actionTypes.load, watchMobileResendCode);
}

export const {
  reducer: mobileResendCodeReducer,
  actions: mobileResendCodeActions,
  actionTypes: mobileResendCodeActionTypes,
} = MobileResendCode;
