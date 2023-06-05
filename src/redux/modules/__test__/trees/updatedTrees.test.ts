import assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';

import {
  getUpdatedTrees,
  updatedTreesActions,
  updatedTreesActionTypes,
  updatedTreesReducer,
  updatedTreesSagas,
  watchUpdatedTrees,
} from 'ranger-redux/modules/trees/updatedTrees';
import {reachedEndUpdatedTreesMock, updatedTreesMock} from 'ranger-redux/modules/__test__/trees/updatedTrees.mock';
import {defaultPaginationItem, PaginationName} from 'ranger-redux/modules/pagination/pagination.reducer';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';
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
      const gen = watchUpdatedTrees({type: updatedTreesActionTypes.load, payload: {}});
      const nextValue = {
        data: [],
        count: 0,
        result: updatedTreesMock,
        status: 200,
        ...defaultPaginationItem,
      };
      gen.next(nextValue);
      gen.next(nextValue);

      assert.deepEqual(
        gen.next(nextValue).value,
        put(setPaginationTotal(PaginationName.UpdatedTrees, updatedTreesMock.count)),
        'should dispatch setPaginationTotal to set count of data',
      );

      assert.deepEqual(gen.next(nextValue).value, select(getUpdatedTrees), 'should select persisted updated trees');

      assert.deepEqual(
        gen.next(nextValue).value,
        put(updatedTreesActions.loadSuccess(updatedTreesMock)),
        'should dispatch updatedTreesActions success',
      );
    });
    it('watchUpdatedTrees success, reachedEnd', () => {
      const gen = watchUpdatedTrees({type: updatedTreesActionTypes.load, payload: {}});
      const nextValue = {
        data: [reachedEndUpdatedTreesMock.data[0]],
        count: 2,
        result: reachedEndUpdatedTreesMock,
        status: 200,
        ...defaultPaginationItem,
        page: 1,
      };
      gen.next(nextValue);
      gen.next(nextValue);

      assert.deepEqual(
        gen.next(nextValue).value,
        put(setPaginationTotal(PaginationName.UpdatedTrees, reachedEndUpdatedTreesMock.count)),
        'should dispatch setPaginationTotal to set count of data',
      );

      assert.deepEqual(gen.next(nextValue).value, select(getUpdatedTrees), 'should select persisted updated trees');

      assert.deepEqual(
        gen.next(nextValue).value,
        put(paginationReachedEnd(PaginationName.UpdatedTrees)),
        'should dispatch pagination reached end',
      );

      assert.deepEqual(
        gen.next(nextValue).value,
        put(updatedTreesActions.loadSuccess({data: [...nextValue.data, ...reachedEndUpdatedTreesMock.data], count: 2})),
        'should dispatch updatedTreesActions success',
      );
    });
    it('watchUpdatedTrees failure', () => {
      const gen = watchUpdatedTrees({type: updatedTreesActionTypes.load, payload: {}});
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
