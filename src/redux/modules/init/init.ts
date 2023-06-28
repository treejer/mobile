import {useCallback} from 'react';
import {Platform} from 'react-native';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {getApiLevel, getBuildNumber, getSystemVersion} from 'react-native-device-info';

import {handleSagaFetchError} from 'utilities/helpers/fetch';
import {TReduxState} from '../../store';
import {profileActions, profileActionsTypes} from '../profile/profile';
import {createWeb3, UPDATE_WEB3} from '../web3/web3';
import {startWatchConnection, UPDATE_WATCH_CONNECTION} from '../netInfo/netInfo';
import {countriesActions} from '../countris/countries';
import {version} from '../../../../package.json';
import {changeCheckMetaData} from '../settings/settings';
import {processBrowserPlatform} from '../browserPlatform/browserPlatform.action';

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

const reducerAction = {
  [INIT_APP]: (state: InitState) => ({
    ...state,
    loading: true,
  }),
  [INIT_APP_COMPLETED]: (state: InitState) => ({
    ...state,
    loading: false,
  }),
};

export function initReducer(state: InitState = initInitialState, action: InitAction) {
  if (reducerAction.hasOwnProperty(action.type)) {
    return reducerAction[action.type](state, action);
  }
  return state;
}

export function* initSagas() {
  yield takeEvery(INIT_APP, watchInitApp);
}

export function* watchInitApp() {
  try {
    yield put(processBrowserPlatform());
    yield put(startWatchConnection());
    yield take(UPDATE_WATCH_CONNECTION);
    yield put(createWeb3());
    yield take(UPDATE_WEB3);
    console.log('started');
    const {accessToken, config}: TReduxState['web3'] = yield select((state: TReduxState) => state.web3);
    if (accessToken) {
      yield put(profileActions.load());
      yield take([profileActionsTypes.loadSuccess, profileActionsTypes.loadFailure]);
      if (config.isMainnet) {
        yield put(changeCheckMetaData(true));
      }
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
  const language = yield select((state: TReduxState) => state.settings.locale);
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
    language,
    platform: Platform.OS,
    os,
    build,
  };
}
