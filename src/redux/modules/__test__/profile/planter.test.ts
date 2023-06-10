import assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';

import {
  planterActions,
  planterActionTypes,
  planterReducer,
  planterSagas,
  watchPlanter,
} from 'ranger-redux/modules/profile/planter';
import {getProfile} from 'ranger-redux/modules/profile/profile';
import {mockProfile} from 'ranger-redux/modules/__test__/currentJourney/currentJourney.mock';
import {handleSagaFetchError} from 'utilities/helpers/fetch';

describe('planter module', () => {
  it('planter module should be defined', () => {
    expect(planterReducer).toBeDefined();
    expect(planterActions).toBeDefined();
    expect(planterActionTypes).toBeDefined();
  });

  describe('planter sagas', () => {
    it('planter sagas should be defined', () => {
      expect(planterSagas).toBeDefined();
    });
    it('planter saga should yield planter watcher', () => {
      const gen = planterSagas();
      assert.deepEqual(
        gen.next().value,
        takeEvery(planterActionTypes.load, watchPlanter),
        'should yield planter watcher',
      );
    });
  });

  describe('watchPlanter', () => {
    it('watchPlanter should be defined', () => {
      expect(watchPlanter).toBeDefined();
    });
    it('watchPlanter success', () => {
      const gen = watchPlanter();
      assert.deepEqual(gen.next().value, select(getProfile), 'should select profile data');
      const nextValue = {
        ...mockProfile,
        result: {},
        status: 200,
      };
      gen.next(nextValue);
      assert.deepEqual(
        gen.next(nextValue).value,
        put(planterActions.loadSuccess({})),
        'should yield planterActions success',
      );
    });
    it('watchPlanter failure', () => {
      const gen = watchPlanter();
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(
        gen.throw(error).value,
        put(planterActions.loadFailure(error.message)),
        'should yield planterActions failure',
      );
      assert.deepEqual(
        //@ts-ignore
        gen.next(error).value,
        handleSagaFetchError(error as any),
        'should yield sagaFetchError handler',
      );
    });
  });
});
