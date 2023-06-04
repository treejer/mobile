import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  assignedTreesActions,
  assignedTreesActionTypes,
  assignedTreesReducer,
  assignedTreesSagas,
  watchAssignedTrees,
} from 'ranger-redux/modules/trees/assignedTrees';
import {assignedTreesMock, reachedEndAssignedTreesMock} from 'ranger-redux/modules/__test__/trees/assignedTrees.mock';
import {handleSagaFetchError} from 'utilities/helpers/fetch';
import {defaultPaginationItem, PaginationName} from 'ranger-redux/modules/pagination/pagination.reducer';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';

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
      const gen = watchAssignedTrees({type: assignedTreesActionTypes.load, payload: {}});
      const nextValue = {
        result: assignedTreesMock,
        status: 200,
        ...defaultPaginationItem,
      };
      gen.next(nextValue);
      gen.next(nextValue);

      assert.deepEqual(
        gen.next(nextValue).value,
        put(setPaginationTotal(PaginationName.AssignedTrees, assignedTreesMock.count)),
      );

      assert.deepEqual(
        gen.next(nextValue).value,
        put(assignedTreesActions.loadSuccess(assignedTreesMock)),
        'should dispatch assignedTreesActions success',
      );
    });
    it('watchAssignedTrees success, reachedEnd', () => {
      const gen = watchAssignedTrees({type: assignedTreesActionTypes.load, payload: {}});
      const nextValue = {
        result: reachedEndAssignedTreesMock,
        status: 200,
        ...defaultPaginationItem,
      };
      gen.next(nextValue);
      gen.next(nextValue);

      assert.deepEqual(
        gen.next(nextValue).value,
        put(setPaginationTotal(PaginationName.AssignedTrees, reachedEndAssignedTreesMock.count)),
      );

      assert.deepEqual(gen.next(nextValue).value, put(paginationReachedEnd(PaginationName.AssignedTrees)));

      assert.deepEqual(
        gen.next(nextValue).value,
        put(assignedTreesActions.loadSuccess(reachedEndAssignedTreesMock)),
        'should dispatch assignedTreesActions success',
      );
    });
    it('watchAssignedTrees failure', () => {
      const gen = watchAssignedTrees({type: assignedTreesActionTypes.load, payload: {}});
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
