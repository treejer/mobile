import {useCallback} from 'react';
import {Platform} from 'react-native';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {getApiLevel, getBuildNumber, getSystemVersion} from 'react-native-device-info';

import {version} from '../../../../package.json';
import {handleSagaFetchError} from 'utilities/helpers/fetch';
import {TReduxState} from 'ranger-redux/store';
import {profileActions, profileActionsTypes} from 'ranger-redux/modules/profile/profile';
import {createWeb3, getAccessToken, UPDATE_WEB3} from 'ranger-redux/modules/web3/web3';
import {startWatchConnection, UPDATE_WATCH_CONNECTION} from 'ranger-redux/modules/netInfo/netInfo';
import {getSettings} from 'ranger-redux/modules/settings/settings';
import {processBrowserPlatform} from 'ranger-redux/modules/browserPlatform/browserPlatform.action';
// import {appInfoActions, appInfoActionTypes, getAppInfo, resetReduxPersist} from 'ranger-redux/modules/appInfo/appInfo';
// import {AppInfoRes} from 'webServices/appInfo/appInfo';
// import {checkPersistedVersion, checkUpdateVersion} from 'utilities/helpers/appVersion';

export const INIT_APP = 'INIT_APP';
export const initApp = () => ({
  type: INIT_APP,
});

export const INIT_APP_COMPLETED = 'INIT_APP_COMPLETED';
export const initAppCompleted = () => ({
  type: INIT_APP_COMPLETED,
});

export type InitState = {
  loading: boolean;
};

export type InitAction = {
  type: string;
};

export const initInitialState: InitState = {
  loading: true,
};

export const reducerAction = {
  [INIT_APP]: (state: InitState, _action: InitAction) => ({
    ...state,
    loading: true,
  }),
  [INIT_APP_COMPLETED]: (state: InitState, _action: InitAction) => ({
    ...state,
    loading: false,
  }),
};

export function initReducer(state: InitState = initInitialState, action: InitAction) {
  if (Object.prototype.hasOwnProperty.call(reducerAction, action.type)) {
    return reducerAction[action.type](state, action);
  }
  return state;
}

export function* initSagas() {
  yield takeEvery(INIT_APP, watchInitApp);
}

export function* watchInitApp() {
  try {
    // const latestVersion: AppInfoRes = yield select(getAppInfo);
    // yield put(appInfoActions.load());
    // const {payload: appInfo} = yield take(appInfoActionTypes.loadSuccess);
    // console.log(latestVersion, appInfo, 'hehehe');
    // if (
    //   !latestVersion?.forceUpdate?.version ||
    //   checkPersistedVersion(appInfo?.forceUpdate?.version, latestVersion?.forceUpdate?.version)
    // ) {
    //   yield put(resetReduxPersist());
    // }
    yield put(processBrowserPlatform());
    yield put(startWatchConnection());
    yield take(UPDATE_WATCH_CONNECTION);
    yield put(createWeb3());
    yield take(UPDATE_WEB3);
    console.log('started');
    const accessToken: string = yield select(getAccessToken);
    console.log(accessToken);
    if (accessToken) {
      yield put(profileActions.load());
      yield take([profileActionsTypes.loadSuccess, profileActionsTypes.loadFailure]);
      yield put(initAppCompleted());
    } else {
      console.log('going to end');
      yield put(profileActions.resetCache());
      yield put(initAppCompleted());
    }
  } catch (e: any) {
    yield handleSagaFetchError(e);
    console.log('going to end');
    yield put(initAppCompleted());
  }
}

export type UseInit = {
  dispatchInit: () => void;
} & InitState;

export function useInit(): UseInit {
  const _init: TReduxState['init'] = useAppSelector(state => state.init);
  const dispatch = useAppDispatch();

  const dispatchInit = useCallback(() => {
    console.log('dispatched');
    dispatch(initApp());
  }, [dispatch]);

  return {
    ..._init,
    dispatchInit,
  };
}

export function* sessionInfo() {
  const {locale}: TReduxState['settings'] = yield select(getSettings);
  const osMethod = Platform.select({
    android: getApiLevel,
    ios: getSystemVersion,
    web: () => version,
    default: () => {},
  });
  const os = yield osMethod();

  const buildMethod = Platform.select({
    android: getBuildNumber,
    ios: getBuildNumber,
    web: () => 1,
    default: () => {},
  });
  const build = yield buildMethod();

  return {
    language: locale,
    platform: Platform.OS,
    os,
    build,
  };
}
