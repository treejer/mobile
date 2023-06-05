import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {defaultPaginationItem, PaginationName} from 'ranger-redux/modules/pagination/pagination.reducer';
import {paginationSagas, watchSetNextPage} from 'ranger-redux/modules/pagination/pagination.saga';
import {plantedTreesActions} from 'ranger-redux/modules/trees/plantedTrees';
import * as actionsList from 'ranger-redux/modules/pagination/pagination.action';

describe('pagination module', () => {
  describe('pagination sagas', () => {
    it('pagination sagas should be defined', () => {
      expect(paginationSagas).toBeDefined();
    });
    it('pagination saga should yield setNextPage watcher', () => {
      const gen = paginationSagas();
      assert.deepEqual(
        gen.next().value,
        takeEvery(actionsList.SET_NEXT_PAGE, watchSetNextPage),
        'should yield setNextPage watcher',
      );
    });
  });
  describe('watchSetNextPage', () => {
    it('watchSetNextPage should be defined', () => {
      expect(watchSetNextPage).toBeDefined();
    });
    it('watchSetNextPage should increase one page to selected pagination item', () => {
      const name = PaginationName.PlantedTrees;
      const action = plantedTreesActions.load;
      const gen = watchSetNextPage({type: actionsList.SET_NEXT_PAGE, name, action});
      gen.next();
      assert.deepEqual(gen.next(defaultPaginationItem).value, put(action()), 'should dispatch passed action');
    });
    it('watchSetNextPage should do nothing | hasMore: false', () => {
      const name = PaginationName.PlantedTrees;
      const gen = watchSetNextPage({type: actionsList.SET_NEXT_PAGE, name});
      gen.next();
      assert.deepEqual(
        gen.next({...defaultPaginationItem, hasMore: false}).value,
        undefined,
        'should do nothing because pagination reached end',
      );
    });
  });
});
