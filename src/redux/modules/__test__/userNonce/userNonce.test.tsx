import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';
import {act, renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import {
  userNonceActions,
  userNonceActionTypes,
  userNonceReducer,
  userNonceSagas,
  useUserNonce,
  watchUserNonce,
} from 'ranger-redux/modules/userNonce/userNonce';
import {handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import * as storeHook from 'utilities/hooks/useStore';

describe('userNonce module', () => {
  it('userNonce module should be defined', () => {
    expect(userNonceReducer).toBeDefined();
    expect(userNonceActions).toBeDefined();
    expect(userNonceActionTypes).toBeDefined();
  });

  describe('userNonce sagas', () => {
    it('userNonce sagas should be defined', () => {
      expect(userNonceSagas).toBeDefined();
    });

    it('userNonce sagas should yield watchUserNonce', () => {
      const gen = userNonceSagas();
      assert.deepEqual(gen.next().value, takeEvery(userNonceActionTypes.load, watchUserNonce));
    });
  });

  describe('watchUserNonce', () => {
    it('watchUserNonce should be defined', () => {
      expect(watchUserNonce).toBeDefined();
    });
    it('watchUserNonce success, without loginData', () => {
      const gen = watchUserNonce({type: userNonceActionTypes.load, payload: {wallet: 'WALLET', magicToken: 'TOKEN'}});

      assert.deepEqual(gen.next().value, sagaFetch('/nonce/WALLET?token=TOKEN'));
      assert.deepEqual(
        gen.next({status: 200, result: {message: 'MESSAGE', userId: 'ID'}}).value,
        put(userNonceActions.loadSuccess({message: 'MESSAGE', userId: 'ID'})),
      );
    });
    it('watchUserNonce success, with email', () => {
      const gen = watchUserNonce({
        type: userNonceActionTypes.load,
        payload: {
          wallet: 'WALLET',
          magicToken: 'TOKEN',
          loginData: {
            email: 'EMAIL',
          },
        },
      });

      assert.deepEqual(gen.next().value, sagaFetch('/nonce/WALLET?token=TOKEN&email=EMAIL'));
      assert.deepEqual(
        gen.next({status: 200, result: {message: 'MESSAGE', userId: 'ID'}}).value,
        put(userNonceActions.loadSuccess({message: 'MESSAGE', userId: 'ID'})),
      );
    });
    it('watchUserNonce success, with phone', () => {
      const gen = watchUserNonce({
        type: userNonceActionTypes.load,
        payload: {
          wallet: 'WALLET',
          magicToken: 'TOKEN',
          loginData: {
            country: 'us',
            mobile: 'MOBILE',
          },
        },
      });

      assert.deepEqual(gen.next().value, sagaFetch('/nonce/WALLET?token=TOKEN&country=us&mobile=MOBILE'));
      assert.deepEqual(
        gen.next({status: 200, result: {message: 'MESSAGE', userId: 'ID'}}).value,
        put(userNonceActions.loadSuccess({message: 'MESSAGE', userId: 'ID'})),
      );
    });
    it('watchUserNonce failure', () => {
      const gen = watchUserNonce({
        type: userNonceActionTypes.load,
        payload: null as any,
      });

      gen.next();
      const error = new Error('error is here!');

      assert.deepEqual(gen.throw(error).value, put(userNonceActions.loadFailure(error)));
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
    });
  });
});

describe('userNonce hook', () => {
  it('useUserNonce should be defined', () => {
    expect(useUserNonce).toBeDefined();
  });

  describe('useUserNonce', () => {
    const mockDispatch = jest.fn((action: () => void) => {});
    const _spy = jest.spyOn(storeHook, 'useAppDispatch').mockImplementation(() => mockDispatch as any);

    const wrapper = {
      wrapper: (props: any) => (
        <AllTheProviders
          {...props}
          initialState={{
            userNonce: {
              data: {message: 'MESSAGE', userId: 'ID'},
              error: null,
              form: null,
              loaded: true,
              loading: false,
            },
          }}
        />
      ),
    };

    const {result} = renderHook(() => useUserNonce(), wrapper);

    it('should return state value', () => {
      expect(result.current.userNonce).toEqual({message: 'MESSAGE', userId: 'ID'});
      expect(result.current.error).toBeNull();
      expect(result.current.form).toBeNull();
      expect(result.current.loading).toBeFalsy();
      expect(result.current.loaded).toBeTruthy();
    });

    it('should dispatch dispatchUserNonce', () => {
      act(() => {
        result.current.dispatchUserNonce({wallet: 'WALLET', magicToken: 'TOKEN'});
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(userNonceActions.load({wallet: 'WALLET', magicToken: 'TOKEN'}));
    });

    it('should dispatch dispatchResetUserNonce', () => {
      act(() => {
        result.current.dispatchResetUserNonce();
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(userNonceActions.resetCache());
    });
  });
});
