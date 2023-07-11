import * as netInfo from 'ranger-redux/modules/netInfo/netInfo';
import assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';
import {getNetInfo, selectNetInfo, START_WATCH_CONNECTION, useNetInfo} from 'ranger-redux/modules/netInfo/netInfo';
import NetInfo from '@react-native-community/netinfo';
import {renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

describe('netInfo actions', () => {
  it('start watch connection', () => {
    const expectedAction = {
      type: netInfo.START_WATCH_CONNECTION,
    };
    expect(netInfo.startWatchConnection()).toEqual(expectedAction);
  });
  it('update watch connection', () => {
    const expectedAction = {
      type: netInfo.UPDATE_WATCH_CONNECTION,
      isConnected: true,
    };
    expect(netInfo.updateWatchConnection(true)).toEqual(expectedAction);
  });
});

describe('netInfo reducer', () => {
  const initialState = {
    isConnected: true,
  };
  it('should return initial state', () => {
    const expectedState = {
      isConnected: true,
    };
    expect(netInfo.netInfoReducer(initialState, {type: ''} as any)).toEqual(expectedState);
  });
  it('should handle START_WATCH_CONNECTION', () => {
    expect(netInfo.netInfoReducer(initialState, {type: netInfo.START_WATCH_CONNECTION} as any)).toEqual(initialState);
  });
  it('should handle UPDATE_WATCH_CONNECTION', () => {
    const expectedState = {
      isConnected: false,
    };
    expect(
      netInfo.netInfoReducer(initialState, {type: netInfo.UPDATE_WATCH_CONNECTION, isConnected: false} as any),
    ).toEqual(expectedState);
  });
});

describe('netInfo saga functions', () => {
  describe('netInfo sagas', () => {
    it('netInfo sagas should be defined', () => {
      expect(netInfo.netInfoSagas).toBeDefined();
    });
    it('netInfoSaga should yield startWatchConnection watcher', () => {
      const dispatch = (action: () => void) => {};
      const gen = netInfo.netInfoSagas({dispatch} as any);
      assert.deepEqual(
        gen.next().value,
        takeEvery(START_WATCH_CONNECTION, netInfo.watchStartWatchConnection, {dispatch} as any),
      );
    });
  });
  describe('watchStartWatchConnection', () => {
    it('watchStartWatchConnection should be defined', () => {
      expect(netInfo.watchStartWatchConnection).toBeDefined();
    });
    it('watchStartWatchConnection success', () => {
      const dispatch = (action: () => void) => {};

      const gen = netInfo.watchStartWatchConnection({dispatch} as any);
      assert.deepEqual(gen.next().value, NetInfo.fetch());
      assert.deepEqual(
        gen.next({isConnected: true, isInternetReachable: true}).value,
        put(netInfo.updateWatchConnection(true)),
      );
    });
    it('watchStartWatchConnection failure', () => {
      const dispatch = (action: () => void) => {};

      const gen = netInfo.watchStartWatchConnection({dispatch} as any);
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(netInfo.updateWatchConnection(false)));
    });
  });
  it('should select netInfo', () => {
    const gen = selectNetInfo();
    assert.deepEqual(gen.next().value, select(getNetInfo));
  });
});

describe('netInfo hook', () => {
  const {result} = renderHook(() => useNetInfo(), {
    wrapper: props => <AllTheProviders {...(props as any)} initialState={{netInfo: {isConnected: true}}} />,
  });

  it('should return state value', () => {
    expect(result.current).toEqual({isConnected: true});
  });
});
