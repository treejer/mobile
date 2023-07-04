import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  updateTreeActions,
  updateTreeActionTypes,
  updateTreeReducer,
  updateTreeSagas,
  watchUpdateTree,
} from 'ranger-redux/modules/submitTreeEvents/updateTree';
import {updateTreeRes} from 'ranger-redux/modules/__test__/submitTreeEvents/updateTree.mock';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {handleSagaFetchError} from 'utilities/helpers/fetch';

describe('updateTree module', () => {
  it('updateTree module should be defined', () => {
    expect(updateTreeReducer).toBeDefined();
    expect(updateTreeActions).toBeDefined();
    expect(updateTreeActionTypes).toBeDefined();
  });

  describe('updateTree sagas', () => {
    it('updateTreeSagas should be defined', () => {
      expect(updateTreeSagas()).toBeDefined();
    });

    it('should yield update tree watcher', () => {
      const gen = updateTreeSagas();

      assert.deepEqual(
        gen.next().value,
        takeEvery(updateTreeActionTypes.load, watchUpdateTree),
        'it should yield watchUpdateTree',
      );
    });
  });

  describe('watchUpdateTree', () => {
    it('watchUpdateTree should be defined', () => {
      expect(watchUpdateTree).toBeDefined();
    });

    it('update tree success', () => {
      const gen = watchUpdateTree({
        type: updateTreeActionTypes.load,
        payload: {
          signature: '',
          treeSpecsJSON: '',
          treeSpecs: '',
          treeId: 21,
        },
      });
      gen.next();
      const nextValue = {result: updateTreeRes, status: 201};
      assert.deepEqual(
        gen.next(nextValue).value,
        put(updateTreeActions.loadSuccess(updateTreeRes)),
        'should dispatch updateTreeActions success',
      );
    });
    it('update tree failure', () => {
      const gen = watchUpdateTree({
        type: updateTreeActionTypes.load,
        payload: {
          signature: '',
          treeSpecsJSON: '',
          treeSpecs: '',
          treeId: 21,
        },
      });
      const error = new Error('error is here');
      gen.next();
      assert.deepEqual(
        gen.throw(error).value,
        put(updateTreeActions.loadFailure(error.message)),
        'should dispatch updateTreeActions failure',
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
