import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  treeDetailsActions,
  treeDetailsActionTypes,
  treeDetailsReducer,
  treeDetailsSagas,
  watchTreeDetails,
} from 'ranger-redux/modules/trees/treeDetails';
import {treeDetailRes} from 'ranger-redux/modules/__test__/trees/treeDetail.mock';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {handleSagaFetchError} from 'utilities/helpers/fetch';

describe('treeDetail module', () => {
  it('treeDetail module should be defined', () => {
    expect(treeDetailsReducer).toBeDefined();
    expect(treeDetailsActions).toBeDefined();
    expect(treeDetailsActionTypes).toBeDefined();
  });

  describe('treeDetail sagas', () => {
    it('treeDetail sagas should be defined', () => {
      expect(treeDetailsSagas).toBeDefined();
    });

    it('should yield tree detail watcher', () => {
      const gen = treeDetailsSagas();
      assert.deepEqual(gen.next().value, takeEvery(treeDetailsActionTypes.load, watchTreeDetails));
    });
  });

  describe('watchTreeDetail', () => {
    it('watchTreeDetail should be defined', () => {
      expect(watchTreeDetails).toBeDefined();
    });

    it('watch tree detail success', () => {
      const gen = watchTreeDetails({type: treeDetailsActionTypes.load, payload: {id: '0x2123'}});
      gen.next();
      assert.deepEqual(
        gen.next({result: treeDetailRes, status: 200}).value,
        put(treeDetailsActions.loadSuccess(treeDetailRes)),
      );
    });
    it('watch tree detail failure', () => {
      const gen = watchTreeDetails({type: treeDetailsActionTypes.load, payload: {id: ''}});
      gen.next();
      const error = new Error('error is here');
      assert.deepEqual(gen.throw(error).value, put(treeDetailsActions.loadFailure(error.message)));
    });
    it('watch tree detail failure in submission', () => {
      const gen = watchTreeDetails({type: treeDetailsActionTypes.load, payload: {id: '', inSubmission: true}});
      gen.next();
      const error = new Error('error is here');
      assert.deepEqual(gen.throw(error).value, put(treeDetailsActions.loadFailure(error.message)));
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
      assert.deepEqual(gen.next().value, put(setSubmitJourneyLoading(false)));
    });
  });
});
