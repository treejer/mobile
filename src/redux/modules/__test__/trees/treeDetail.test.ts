import {
  treeDetailActions,
  treeDetailActionTypes,
  treeDetailReducer,
  treeDetailsSagas,
  watchTreeDetails,
} from 'ranger-redux/modules/trees/treeDetails';
import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';
import {treeDetailRes} from 'ranger-redux/modules/__test__/trees/treeDetail.mock';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';

describe('treeDetail module', () => {
  it('treeDetail module should be defined', () => {
    expect(treeDetailReducer).toBeDefined();
    expect(treeDetailActions).toBeDefined();
    expect(treeDetailActionTypes).toBeDefined();
  });

  describe('treeDetail sagas', () => {
    it('treeDetail sagas should be defined', () => {
      expect(treeDetailsSagas).toBeDefined();
    });

    it('should yield tree detail watcher', () => {
      const gen = treeDetailsSagas();
      assert.deepEqual(gen.next().value, takeEvery(treeDetailActionTypes.load, watchTreeDetails));
    });
  });

  describe('watchTreeDetail', () => {
    it('watchTreeDetail should be defined', () => {
      expect(watchTreeDetails).toBeDefined();
    });

    it('watch tree detail success', () => {
      const gen = watchTreeDetails({type: treeDetailActionTypes.load, payload: {id: '0x2123'}});
      gen.next();
      assert.deepEqual(
        gen.next({result: treeDetailRes, status: 200}).value,
        put(treeDetailActions.loadSuccess(treeDetailRes)),
      );
    });
    it('watch tree detail failure', () => {
      const gen = watchTreeDetails({type: treeDetailActionTypes.load, payload: {id: ''}});
      gen.next();
      const error = new Error('error is here');
      assert.deepEqual(gen.throw(error).value, put(treeDetailActions.loadFailure(error.message)));
    });
    it('watch tree detail failure in submission', () => {
      const gen = watchTreeDetails({type: treeDetailActionTypes.load, payload: {id: '', inSubmission: true}});
      gen.next();
      const error = new Error('error is here');
      assert.deepEqual(gen.throw(error).value, put(treeDetailActions.loadFailure(error.message)));
      assert.deepEqual(gen.next().value, put(setSubmitJourneyLoading(false)));
    });
  });
});
