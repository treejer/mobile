import {useCallback} from 'react';
import {put, takeEvery} from 'redux-saga/effects';
import ReduxFetchState from 'redux-fetch-state';

import {AppInfoRes} from 'webServices/appInfo/appInfo';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {TReduxState} from 'ranger-redux/store';

const AppInfo = new ReduxFetchState<AppInfoRes, null, string>('appInfo');

export function* watchAppInfo() {
  try {
    const res: FetchResult<AppInfoRes> = yield sagaFetch<AppInfoRes>('/settings', {
      method: 'GET',
      configUrl: 'treejerNestApiUrl',
    });
    console.log(res, 'result is here');
    yield put(AppInfo.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(AppInfo.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* appInfoSagas() {
  yield takeEvery(AppInfo.actionTypes.load, watchAppInfo);
}

export function useAppInfo() {
  const {data: appInfo, ...appInfoState} = useAppSelector(state => state.appInfo);
  const dispatch = useAppDispatch();

  const dispatchCheckAppVersion = useCallback(() => {
    dispatch(AppInfo.actions.load());
  }, [dispatch]);

  return {
    appInfo,
    appInfoState,
    dispatchCheckAppVersion,
  };
}

export const {actions: appInfoActions, reducer: appInfoReducer, actionTypes: appInfoActionTypes} = AppInfo;

export const getAppInfo = (state: TReduxState) => state.appInfo.data;

export const RESET_REDUX_PERSIST = 'RESET_REDUX_PERSIST';
export const resetReduxPersist = () => ({
  type: RESET_REDUX_PERSIST,
});
