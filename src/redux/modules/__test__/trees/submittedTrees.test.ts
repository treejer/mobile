import assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';

import {handleSagaFetchError} from 'utilities/helpers/fetch';
import {
  getSubmittedTrees,
  submittedTreesActions,
  submittedTreesActionTypes,
  submittedTreesReducer,
  submittedTreesSagas,
  watchSubmittedTrees,
} from 'ranger-redux/modules/trees/submittedTrees';
import {defaultPaginationItem, PaginationName} from 'ranger-redux/modules/pagination/pagination.reducer';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';
import {
  reachedEndSubmittedTreesMock,
  submittedTreesMock,
} from 'ranger-redux/modules/__test__/trees/submittedTrees.mock';

describe('submittedTrees module', () => {
  it('submittedTrees module should be defined', () => {
    expect(submittedTreesReducer).toBeDefined();
    expect(submittedTreesActions).toBeDefined();
    expect(submittedTreesActionTypes).toBeDefined();
  });
  describe('submittedTrees sagas', () => {
    it('submittedTrees sagas should be defined', () => {
      expect(submittedTreesSagas).toBeDefined();
    });
    it('submittedTrees sagas should yield submittedTrees watcher', () => {
      const gen = submittedTreesSagas();
      assert.deepEqual(
        gen.next().value,
        takeEvery(submittedTreesActionTypes.load, watchSubmittedTrees),
        'should yield submittedTreesWatcher',
      );
    });
  });
  describe('watchSubmittedTrees', () => {
    it('watchSubmittedTrees should be defined', () => {
      expect(watchSubmittedTrees).toBeDefined();
    });
    it('watchSubmittedTrees success', () => {
      const gen = watchSubmittedTrees();
      const nextValue = {
        ...defaultPaginationItem,
        page: 1,
        data: [{}, {}] as any,
        count: 5,
        error: null,
        loaded: true,
        result: submittedTreesMock as any,
        status: 200,
      };
      gen.next();
      gen.next(nextValue);
      assert.deepEqual(
        gen.next(nextValue).value,
        select(getSubmittedTrees),
        'should select persisted submitted trees data',
      );
      assert.deepEqual(
        gen.next(nextValue).value,
        put(
          submittedTreesActions.loadSuccess({
            data: [...submittedTreesMock.data, ...nextValue.data],
            hasMore: submittedTreesMock.hasMore,
          } as any),
        ),
        'should dispatch submittedTreeActions success',
      );
    });
    it('watchSubmittedTrees success, reached end', () => {
      const gen = watchSubmittedTrees();
      const nextValue = {
        ...defaultPaginationItem,
        data: [] as any,
        count: 2,
        error: null,
        loaded: true,
        result: reachedEndSubmittedTreesMock as any,
        status: 200,
      };
      gen.next();
      gen.next(nextValue);

      assert.deepEqual(
        gen.next(nextValue).value,
        select(getSubmittedTrees),
        'should select persisted submitted trees data',
      );
      assert.deepEqual(
        gen.next(nextValue).value,
        put(paginationReachedEnd(PaginationName.SubmittedTrees)),
        'should dispatch pagination reached end action',
      );
      assert.deepEqual(
        gen.next(nextValue).value,
        put(setPaginationTotal(PaginationName.SubmittedTrees, [...nextValue.result.data, ...nextValue.data].length)),
        'should dispatch setPaginationTotal to set count of data',
      );
      assert.deepEqual(
        gen.next(nextValue).value,
        put(
          submittedTreesActions.loadSuccess({
            data: [...reachedEndSubmittedTreesMock.data, ...nextValue.data],
            hasMore: reachedEndSubmittedTreesMock.hasMore,
          } as any),
        ),
        'should dispatch submittedTreeActions success',
      );
    });
    it('watchSubmittedTrees failure', () => {
      const gen = watchSubmittedTrees();
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(
        gen.throw(error).value,
        put(submittedTreesActions.loadFailure(error.message)),
        'should dispatch submittedTreesActions failure',
      );
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
    });
  });
});
