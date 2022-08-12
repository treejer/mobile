import {put, select, takeEvery, take} from 'redux-saga/effects';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {TReduxState} from 'redux/store';

import {handleSagaFetchError} from 'utilities/helpers/fetch';
import {Platform} from 'react-native';
import {getApiLevel, getBuildNumber, getSystemVersion} from 'react-native-device-info';
import {version} from '../../../../package.json';

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
    const {token} = yield select((state: TReduxState) => state.token);
    if (token) {
      //* @logic-saga
    } else {
      yield put(initAppCompleted());
    }
  } catch (e: any) {
    yield handleSagaFetchError(e);
    yield put(initAppCompleted());
  }
}

export function useInit() {
  const _init = useAppSelector(state => state.init);
  const dispatch = useAppDispatch();

  const dispatchInit = () => {
    dispatch(initApp());
  };

  return {
    ..._init,
    dispatchInit,
  };
}

export function* sessionInfo() {
  const language = yield select((state: TReduxState) => state.language.locale);
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
