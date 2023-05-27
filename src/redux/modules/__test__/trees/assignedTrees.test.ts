import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  assignedTreesActions,
  assignedTreesActionTypes,
  assignedTreesReducer,
  assignedTreesSagas,
  watchAssignedTrees,
} from 'ranger-redux/modules/trees/assignedTrees';
import {assignedTreesMock} from 'ranger-redux/modules/__test__/trees/assignedTrees.mock';
import {handleSagaFetchError} from 'utilities/helpers/fetch';

describe('assignedTrees', () => {
  it('assignedTrees module should be defined', () => {
    expect(assignedTreesReducer).toBeDefined();
    expect(assignedTreesActions).toBeDefined();
    expect(assignedTreesActionTypes).toBeDefined();
  });
  describe('assignedTrees sagas', () => {
    it('assignedTrees sagas should be defined', () => {
      expect(assignedTreesSagas).toBeDefined();
    });
    it('assignedTrees sagas should yield assignedTrees watcher', () => {
      const gen = assignedTreesSagas();
      assert.deepEqual(
        gen.next().value,
        takeEvery(assignedTreesActionTypes.load, watchAssignedTrees),
        'should yield watchAssignedTrees',
      );
    });
  });
  describe('watchAssignedTrees', () => {
    it('watchAssignedTrees should be defined', () => {
      expect(watchAssignedTrees).toBeDefined();
    });
    it('watchAssignedTrees success', () => {
      const gen = watchAssignedTrees();
      gen.next();
      assert.deepEqual(
        gen.next({result: assignedTreesMock, status: 200}).value,
        put(assignedTreesActions.loadSuccess(assignedTreesMock)),
        'should dispatch assignedTreesActions success',
      );
    });
    it('watchAssignedTrees failure', () => {
      const gen = watchAssignedTrees();
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(
        gen.throw(error).value,
        put(assignedTreesActions.loadFailure(error.message)),
        'should dispatch assignedTreesActions failure',
      );
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
    });
  });
});
