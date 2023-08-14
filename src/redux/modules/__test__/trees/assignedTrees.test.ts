import assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';

import {
  assignedTreesActions,
  assignedTreesActionTypes,
  assignedTreesReducer,
  assignedTreesSagas,
  getAssignedTrees,
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
        data: [],
        count: 0,
        result: assignedTreesMock,
        status: 200,
        ...defaultPaginationItem,
      };
      gen.next(nextValue);
      gen.next(nextValue);

      assert.deepEqual(
        gen.next(nextValue).value,
        put(setPaginationTotal(PaginationName.AssignedTrees, assignedTreesMock.count)),
        'should dispatch setPaginationTotal to set count of data',
      );

      assert.deepEqual(gen.next(nextValue).value, select(getAssignedTrees), 'should select persisted assigned trees');

      assert.deepEqual(
        gen.next(nextValue).value,
        put(assignedTreesActions.loadSuccess(assignedTreesMock)),
        'should dispatch assignedTreesActions success',
      );
    });
    it('watchAssignedTrees success, reachedEnd', () => {
      const gen = watchAssignedTrees({type: assignedTreesActionTypes.load, payload: {}});
      const nextValue = {
        data: [reachedEndAssignedTreesMock.data[0]],
        count: 2,
        result: reachedEndAssignedTreesMock,
        status: 200,
        ...defaultPaginationItem,
        page: 1,
      };
      gen.next(nextValue);
      gen.next(nextValue);

      assert.deepEqual(
        gen.next(nextValue).value,
        put(setPaginationTotal(PaginationName.AssignedTrees, reachedEndAssignedTreesMock.count)),
        'should dispatch setPaginationTotal to set count of data',
      );

      assert.deepEqual(gen.next(nextValue).value, select(getAssignedTrees), 'should select persisted assigned trees');

      assert.deepEqual(
        gen.next(nextValue).value,
        put(paginationReachedEnd(PaginationName.AssignedTrees)),
        'should dispatch pagination reached end',
      );

      assert.deepEqual(
        gen.next(nextValue).value,
        put(
          assignedTreesActions.loadSuccess({data: [...nextValue.data, ...reachedEndAssignedTreesMock.data], count: 2}),
        ),
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
