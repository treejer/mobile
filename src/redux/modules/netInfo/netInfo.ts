import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {Action, Dispatch} from 'redux';
import {put, select, takeEvery} from 'redux-saga/effects';
import {TReduxState} from '../../store';

export type TNetInfo = {
  isConnected: boolean;
};

const initialState: TNetInfo = {
  isConnected: true,
};

type TNetInfoAction = {
  type: string;
  isConnected: boolean;
  dispatch: Dispatch<Action<any>>;
};

export const START_WATCH_CONNECTION = 'START_WATCH_CONNECTION';
export function startWatchConnection(dispatch: Dispatch<Action<any>>) {
  return {type: START_WATCH_CONNECTION, dispatch};
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

export function* watchStartWatchConnection(action: TNetInfoAction) {
  try {
    const {dispatch} = action;
    NetInfo.addEventListener((state: NetInfoState) => {
      dispatch(updateWatchConnection((state?.isConnected && state?.isInternetReachable) || false));
    });
  } catch (error) {
    yield put(updateWatchConnection(false));
  }
}

export function* netInfoSagas() {
  yield takeEvery(START_WATCH_CONNECTION, watchStartWatchConnection);
}
export function* selectNetInfo() {
  return yield select((state: TReduxState) => state.netInfo.isConnected);
}
