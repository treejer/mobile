import * as assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  plantedTreesActions,
  plantedTreesActionTypes,
  plantedTreesReducer,
  plantedTreesSagas,
  watchPlantedTrees,
} from 'ranger-redux/modules/trees/plantedTrees';
import {plantedTressMock, plantedTressReachedEndMock} from 'ranger-redux/modules/__test__/trees/plantedTrees.mock';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';
import {defaultPaginationItem, PaginationName} from 'ranger-redux/modules/pagination/pagination.reducer';
import {handleSagaFetchError} from 'utilities/helpers/fetch';

describe('plantedTrees', () => {
  it('plantedTrees module should be defined', () => {
    expect(plantedTreesReducer).toBeDefined();
    expect(plantedTreesActions).toBeDefined();
    expect(plantedTreesActionTypes).toBeDefined();
  });
  describe('plantedTrees sagas', () => {
    it('plantedTrees sagas should be defined', () => {
      expect(plantedTreesSagas).toBeDefined();
    });
    it('plantedTrees sagas should yield plantedTrees watcher', () => {
      const gen = plantedTreesSagas();
      assert.deepEqual(
        gen.next().value,
        takeEvery(plantedTreesActionTypes.load, watchPlantedTrees),
        'should yield watchPlantedTrees',
      );
    });
  });
  describe('watchPlantedTrees', () => {
    it('watchPlantedTrees should be defined', () => {
      expect(watchPlantedTrees).toBeDefined();
    });
    it('watchPlantedTrees success', () => {
      const gen = watchPlantedTrees({type: plantedTreesActionTypes.load, payload: {sort: {signer: 1, nonce: 1}}});
      const nextValue = {
        ...defaultPaginationItem,
        result: plantedTressMock,
        status: 200,
      };
      gen.next(nextValue);
      gen.next(nextValue);

      assert.deepEqual(
        gen.next(nextValue).value,
        put(setPaginationTotal(PaginationName.PlantedTrees, plantedTressMock.count)),
      );
      assert.deepEqual(
        gen.next(nextValue).value,
        put(plantedTreesActions.loadSuccess(plantedTressMock)),
        'should dispatch plantedTreesActions success',
      );
    });
    it('watchPlantedTrees success, reachedEnd', () => {
      const gen = watchPlantedTrees({type: plantedTreesActionTypes.load, payload: {sort: {signer: 1, nonce: 1}}});
      const nextValue = {
        ...defaultPaginationItem,
        result: plantedTressReachedEndMock,
        status: 200,
      };
      gen.next(nextValue);
      gen.next(nextValue);

      assert.deepEqual(
        gen.next(nextValue).value,
        put(setPaginationTotal(PaginationName.PlantedTrees, plantedTressReachedEndMock.count)),
      );
      assert.deepEqual(gen.next(nextValue).value, put(paginationReachedEnd(PaginationName.PlantedTrees)));
      assert.deepEqual(
        gen.next(nextValue).value,
        put(plantedTreesActions.loadSuccess(plantedTressReachedEndMock)),
        'should dispatch plantedTreesActions success',
      );
    });
    it('watchPlantedTrees failure', () => {
      const gen = watchPlantedTrees({type: plantedTreesActionTypes.load, payload: {}});
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(
        gen.throw(error).value,
        put(plantedTreesActions.loadFailure(error.message)),
        'should dispatch plantedTreesActions failure',
      );
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
    });
  });
});
