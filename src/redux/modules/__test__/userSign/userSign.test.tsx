import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';
import {act, renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import {
  userSignActions,
  userSignActionTypes,
  userSignReducer,
  userSignSagas,
  useUserSign,
  watchUserSign,
} from 'ranger-redux/modules/userSign/userSign';
import {handleSagaFetchError} from 'utilities/helpers/fetch';
import * as storeHook from 'utilities/hooks/useStore';

describe('userSign module', () => {
  it('userSign module should be defined', () => {
    expect(userSignReducer).toBeDefined();
    expect(userSignActions).toBeDefined();
    expect(userSignActionTypes).toBeDefined();
  });

  describe('userSign sagas', () => {
    it('userSign sagas should be defined', () => {
      expect(userSignSagas).toBeDefined();
    });

    it('userSignSagas should yield watchUserSign', () => {
      const gen = userSignSagas();
      assert.deepEqual(gen.next().value, takeEvery(userSignActionTypes.load, watchUserSign));
    });
  });

  describe('watchUserSign', () => {
    it('watchUserSign should be defined', () => {
      expect(watchUserSign).toBeDefined();
    });

    it('watchUserSign success', () => {
      const gen = watchUserSign({type: userSignActionTypes.load, payload: {wallet: 'WALLET', signature: 'sig'}});
      gen.next();
      assert.deepEqual(
        gen.next({result: {access_token: 'TOKEN'}, status: 200}).value,
        put(userSignActions.loadSuccess({access_token: 'TOKEN'})),
      );
    });

    it('watchUserSign failure', () => {
      const gen = watchUserSign({type: userSignActionTypes.load, payload: null as any});
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(userSignActions.loadFailure(error)));
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
    });
  });
});

describe('userSign hook', () => {
  it('useUserSign should be defined', () => {
    expect(useUserSign).toBeDefined();
  });

  describe('useUserSign', () => {
    const mockDispatch = jest.fn((action: () => void) => {});
    const _spy = jest.spyOn(storeHook, 'useAppDispatch').mockImplementation(() => mockDispatch as any);
    const wrapper = {
      wrapper: (props: any) => (
        <AllTheProviders
          {...props}
          initialState={{
            userSign: {data: {access_token: 'TOKEN'}, loaded: true, loading: false, form: null, error: null},
          }}
        />
      ),
    };
    const {result} = renderHook(() => useUserSign(), wrapper);

    it('should return state value', () => {
      expect(result.current.userSign).toEqual({access_token: 'TOKEN'});
      expect(result.current.loading).toBeFalsy();
      expect(result.current.loaded).toBeTruthy();
      expect(result.current.error).toBeNull();
      expect(result.current.form).toBeNull();
    });

    it('should dispatch dispatchUserSign', () => {
      act(() => {
        result.current.dispatchUserSign({wallet: 'WALLET', signature: 'sig'});
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(userSignActions.load({wallet: 'WALLET', signature: 'sig'}));
    });

    it('should dispatch dispatchResetUserSign', () => {
      act(() => {
        result.current.dispatchResetUserSign();
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(userSignActions.resetCache());
    });
  });
});
