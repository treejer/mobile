import assert from 'assert';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import {renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import {handleSagaFetchError} from 'utilities/helpers/fetch';
import {checkAppVersion} from 'ranger-redux/modules/appInfo/appInfo';
import {processBrowserPlatform} from 'ranger-redux/modules/browserPlatform/browserPlatform.action';
import {startWatchConnection, UPDATE_WATCH_CONNECTION} from 'ranger-redux/modules/netInfo/netInfo';
import {createWeb3, getAccessToken, UPDATE_WEB3} from 'ranger-redux/modules/web3/web3';
import {profileActions, profileActionsTypes} from 'ranger-redux/modules/profile/profile';
import * as initApp from 'ranger-redux/modules/init/init';

describe('init actions', () => {
  it('init app', () => {
    const expectedAction = {
      type: initApp.INIT_APP,
    };
    expect(initApp.initApp()).toEqual(expectedAction);
  });
  it('init app completed', () => {
    const expectedAction = {
      type: initApp.INIT_APP_COMPLETED,
    };
    expect(initApp.initAppCompleted()).toEqual(expectedAction);
  });
});

describe('reducer action', () => {
  it('should call init app method', () => {
    const expectedValue = {
      loading: true,
    };
    expect(initApp.reducerAction[initApp.INIT_APP]({loading: false}, {type: initApp.INIT_APP})).toEqual(expectedValue);
  });
  it('should call init app completed method', () => {
    const expectedValue = {
      loading: false,
    };
    expect(
      initApp.reducerAction[initApp.INIT_APP_COMPLETED]({loading: true}, {type: initApp.INIT_APP_COMPLETED}),
    ).toEqual(expectedValue);
  });

  describe('init reducer', () => {
    const initialState = {
      loading: true,
    };
    it('should return initialState', () => {
      expect(initApp.initReducer(initialState, {type: ''})).toEqual(initialState);
    });
    it('should handle INIT_APP', () => {
      expect(initApp.initReducer(initialState, {type: initApp.INIT_APP})).toEqual(initialState);
    });
    it('should handle INIT_APP_COMPLETED', () => {
      const expectedState = {
        loading: false,
      };
      expect(initApp.initReducer(initialState, {type: initApp.INIT_APP_COMPLETED})).toEqual(expectedState);
    });
  });
});

describe('init saga functions', () => {
  describe('init sagas', () => {
    it('init sagas should be defined', () => {
      expect(initApp.initSagas).toBeDefined();
    });
    it('init sagas should be yield initApp watcher', () => {
      const gen = initApp.initSagas();
      assert.deepEqual(gen.next().value, takeEvery(initApp.INIT_APP, initApp.watchInitApp));
    });
  });
  describe('watchInitApp', () => {
    it('watchInitApp should be defined', () => {
      expect(initApp.watchInitApp).toBeDefined();
    });
    it('watchInitApp success loggedIn', () => {
      const gen = initApp.watchInitApp();
      assert.deepEqual(gen.next().value, put(checkAppVersion()));
      assert.deepEqual(gen.next().value, put(processBrowserPlatform()));
      assert.deepEqual(gen.next().value, put(startWatchConnection()));
      assert.deepEqual(gen.next().value, take(UPDATE_WATCH_CONNECTION));
      assert.deepEqual(gen.next().value, put(createWeb3()));
      assert.deepEqual(gen.next().value, take(UPDATE_WEB3));
      assert.deepEqual(gen.next().value, select(getAccessToken));
      const loggedInMock = 'TOKEN';

      assert.deepEqual(gen.next(loggedInMock).value, put(profileActions.load()));
      assert.deepEqual(
        gen.next(loggedInMock).value,
        take([profileActionsTypes.loadSuccess, profileActionsTypes.loadFailure]),
      );
      assert.deepEqual(gen.next().value, put(initApp.initAppCompleted()));
      assert.deepEqual(gen.next().value, undefined);
    });
    it('watchInitApp success loggedOut', () => {
      const gen = initApp.watchInitApp();
      assert.deepEqual(gen.next().value, put(checkAppVersion()));
      assert.deepEqual(gen.next().value, put(processBrowserPlatform()));
      assert.deepEqual(gen.next().value, put(startWatchConnection()));
      assert.deepEqual(gen.next().value, take(UPDATE_WATCH_CONNECTION));
      assert.deepEqual(gen.next().value, put(createWeb3()));
      assert.deepEqual(gen.next().value, take(UPDATE_WEB3));
      assert.deepEqual(gen.next().value, select(getAccessToken));
      const loggedOutMock = '';
      assert.deepEqual(gen.next(loggedOutMock).value, put(profileActions.resetCache()));
      assert.deepEqual(gen.next().value, put(initApp.initAppCompleted()));
      assert.deepEqual(gen.next().value, undefined);
    });
    it('watchInitApp failure', () => {
      const gen = initApp.watchInitApp();
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, handleSagaFetchError(error as any));
      assert.deepEqual(gen.next().value, put(initApp.initAppCompleted()));
    });
  });
});

describe('init hook', () => {
  const {result} = renderHook(() => initApp.useInit(), {
    wrapper: props => <AllTheProviders {...(props as any)} initialState={{init: {loading: false}}} />,
  });

  it('should return state value', () => {
    expect(result.current.loading).toBe(false);
  });
});
