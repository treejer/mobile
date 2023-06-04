import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  defaultPaginationItem,
  PaginationName,
  PaginationNameFetcher,
} from 'ranger-redux/modules/pagination/pagination.reducer';
import {paginationSagas, watchSetNextPage} from 'ranger-redux/modules/pagination/pagination.saga';
import * as actionsList from 'ranger-redux/modules/pagination/pagination.action';

describe('pagination module', () => {
  describe('pagination sagas', () => {
    it('pagination sagas should be defined', () => {
      expect(paginationSagas).toBeDefined();
    });
    it('pagination saga should yield setNextPage watcher', () => {
      const gen = paginationSagas();
      assert.deepEqual(gen.next().value, takeEvery(actionsList.SET_NEXT_PAGE, watchSetNextPage));
    });
  });
  describe('watchSetNextPage', () => {
    it('watchSetNextPage should be defined', () => {
      expect(watchSetNextPage).toBeDefined();
    });
    it('watchSetNextPage should increase one page to selected pagination item', () => {
      const name = PaginationName.PlantedTrees;
      const gen = watchSetNextPage({type: actionsList.SET_NEXT_PAGE, name});
      gen.next();
      assert.deepEqual(gen.next(defaultPaginationItem).value, put(PaginationNameFetcher[name]()));
    });
    it('watchSetNextPage should do nothing | hasMore: false', () => {
      const name = PaginationName.PlantedTrees;
      const gen = watchSetNextPage({type: actionsList.SET_NEXT_PAGE, name});
      gen.next();
      assert.deepEqual(gen.next({...defaultPaginationItem, hasMore: false}).value, undefined);
    });
  });
});
