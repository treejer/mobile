import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  updatedTreesActions,
  updatedTreesActionTypes,
  updatedTreesReducer,
  updatedTreesSagas,
  watchUpdatedTrees,
} from 'ranger-redux/modules/trees/updatedTrees';
import {updatedTreesMock} from 'ranger-redux/modules/__test__/trees/updatedTrees.mock';
import {handleSagaFetchError} from 'utilities/helpers/fetch';

describe('updatedTrees', () => {
  it('updatedTrees module should be defined', () => {
    expect(updatedTreesReducer).toBeDefined();
    expect(updatedTreesActions).toBeDefined();
    expect(updatedTreesActionTypes).toBeDefined();
  });
  describe('updatedTrees sagas', () => {
    it('updatedTrees sagas should be defined', () => {
      expect(updatedTreesSagas).toBeDefined();
    });
    it('updatedTrees sagas should yield updatedTrees watcher', () => {
      const gen = updatedTreesSagas();
      assert.deepEqual(
        gen.next().value,
        takeEvery(updatedTreesActionTypes.load, watchUpdatedTrees),
        'should yield watchUpdatedTrees',
      );
    });
  });
  describe('watchUpdatedTrees', () => {
    it('watchUpdatedTrees', () => {
      expect(watchUpdatedTrees).toBeDefined();
    });
    it('watchUpdatedTrees success', () => {
      const gen = watchUpdatedTrees();
      gen.next();
      assert.deepEqual(
        gen.next({result: updatedTreesMock, status: 200}).value,
        put(updatedTreesActions.loadSuccess(updatedTreesMock)),
        'should dispatch updatedTreesActions success',
      );
    });
    it('watchUpdatedTrees failure', () => {
      const gen = watchUpdatedTrees();
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(
        gen.throw(error).value,
        put(updatedTreesActions.loadFailure(error.message)),
        'should dispatch updatedTreesActions failure',
      );
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
    });
  });
});
