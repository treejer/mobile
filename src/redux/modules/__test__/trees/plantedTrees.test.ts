import * as assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  plantedTreesActions,
  plantedTreesActionTypes,
  plantedTreesReducer,
  plantedTreesSagas,
  watchPlantedTrees,
} from 'ranger-redux/modules/trees/plantedTrees';
import {plantedTressMock} from 'ranger-redux/modules/__test__/trees/plantedTrees.mock';
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
      const gen = watchPlantedTrees();
      gen.next();
      assert.deepEqual(
        gen.next({result: plantedTressMock, status: 200}).value,
        put(plantedTreesActions.loadSuccess(plantedTressMock)),
        'should dispatch plantedTreesActions success',
      );
    });
    it('watchPlantedTrees failure', () => {
      const gen = watchPlantedTrees();
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
