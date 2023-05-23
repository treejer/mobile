import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {
  TMobileSendCodeAction,
  TMobileSendCodePayload,
  TMobileSendCodeRes,
} from 'webServices/verification/mobileSendCode';

const MobileSendCode = new ReduxFetchState<TMobileSendCodeRes, TMobileSendCodePayload, string>('mobileSendCode');

export function* watchMobileSendCode({payload}: TMobileSendCodeAction) {
  try {
    const {mobileNumber, country} = payload || {};
    const res: FetchResult<TMobileSendCodeRes> = yield sagaFetch<TMobileSendCodeRes, TMobileSendCodePayload>(
      `/mobile/send`,
      {
        configUrl: 'treejerNestApiUrl',
        method: 'PATCH',
        data: {
          mobileNumber,
          country,
        },
      },
    );
    yield put(MobileSendCode.actions.loadSuccess(res.result));
    yield showSagaAlert({
      message: res.result.message,
      mode: AlertMode.Success,
    });
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(MobileSendCode.actions.loadFailure(Array.isArray(message) ? message[0] : message));
    yield handleSagaFetchError(e);
  }
}

export function* mobileSendCodeSagas() {
  yield takeEvery(MobileSendCode.actionTypes.load, watchMobileSendCode);
}

export const {
  reducer: mobileSendCodeReducer,
  actions: mobileSendCodeActions,
  actionTypes: mobileSendCodeActionTypes,
} = MobileSendCode;
