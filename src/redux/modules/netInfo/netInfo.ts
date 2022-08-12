import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {put, select, takeEvery} from 'redux-saga/effects';
import {store, TReduxState} from '../../store';

export type TNetInfo = {
  isConnected: boolean;
};

const initialState: TNetInfo = {
  isConnected: true,
};

type TNetInfoAction = {
  type: string;
  isConnected: boolean;
};

export const START_WATCH_CONNECTION = 'START_WATCH_CONNECTION';
export function startWatchConnection() {
  return {type: START_WATCH_CONNECTION};
}

export const UPDATE_WATCH_CONNECTION = 'UPDATE_WATCH_CONNECTION';
export function updateWatchConnection(isConnected: boolean) {
  return {type: UPDATE_WATCH_CONNECTION, isConnected};
}

export const netInfoReducer = (state: TNetInfo = initialState, action: TNetInfoAction): TNetInfo => {
  switch (action.type) {
    case START_WATCH_CONNECTION: {
      return state;
    }
    case UPDATE_WATCH_CONNECTION: {
      return {
        isConnected: action.isConnected,
      };
    }
    default: {
      return state;
    }
  }
};

export function* watchStartWatchConnection() {
  try {
    NetInfo.addEventListener((state: NetInfoState) => {
      store.dispatch(updateWatchConnection((state?.isConnected && state?.isInternetReachable) || false));
    });
  } catch (error) {
    yield put(updateWatchConnection(false));
  }
}

export function* watchConnectionSagas() {
  yield takeEvery(START_WATCH_CONNECTION, watchStartWatchConnection);
}
export function* selectNetInfo() {
  return yield select((state: TReduxState) => state.netInfo.isConnected);
}
