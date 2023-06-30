import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  plantTreeActions,
  plantTreeActionTypes,
  plantTreeReducer,
  plantTreeSagas,
  watchPlantTree,
} from 'ranger-redux/modules/submitTreeEvents/plantTree';
import {plantTreeRes} from 'ranger-redux/modules/__test__/submitTreeEvents/plantTree.mock';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {currentTimestamp} from 'utilities/helpers/date';
import {handleSagaFetchError} from 'utilities/helpers/fetch';

describe('plantTree module', () => {
  it('plantTree module should be defined', () => {
    expect(plantTreeReducer).toBeDefined();
    expect(plantTreeActions).toBeDefined();
    expect(plantTreeActionTypes).toBeDefined();
  });

  describe('plantTree sagas', () => {
    it('plantTreeSagas should be defined', () => {
      expect(plantTreeSagas()).toBeDefined();
    });

    it('should yield plant tree watcher', () => {
      const gen = plantTreeSagas();

      assert.deepEqual(
        gen.next().value,
        takeEvery(plantTreeActionTypes.load, watchPlantTree),
        'it should yield watchPlantTree',
      );
    });
  });

  describe('watchPlantTree', () => {
    it('watchPlantTree should be defined', () => {
      expect(watchPlantTree).toBeDefined();
    });

    it('plant tree success', () => {
      const date = currentTimestamp();
      const gen = watchPlantTree({
        type: plantTreeActionTypes.load,
        payload: {
          birthDate: date,
          signature: '',
          treeSpecs: '',
        },
      });
      gen.next();
      const nextValue = {result: plantTreeRes, status: 201};
      assert.deepEqual(
        gen.next(nextValue).value,
        put(plantTreeActions.loadSuccess(plantTreeRes)),
        'should dispatch plantTreeActions success',
      );
    });
    it('plant tree failure', () => {
      const date = currentTimestamp();
      const gen = watchPlantTree({
        type: plantTreeActionTypes.load,
        payload: {signature: '', treeSpecs: '', birthDate: date},
      });
      const error = new Error('error is here');
      gen.next();
      assert.deepEqual(
        gen.throw(error).value,
        put(plantTreeActions.loadFailure(error.message)),
        'should dispatch plantTreeActions failure',
      );
      assert.deepEqual(
        gen.next().value,
        put(setSubmitJourneyLoading(false)),
        'should dispatch setSubmitJourneyLoading: false',
      );
      assert.deepEqual(
        gen.next().value,
        handleSagaFetchError(error as any, {logoutUnauthorized: false}),
        'yield sagaFetchError',
      );
    });
  });
});
