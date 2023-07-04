import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  assignedTreeActions,
  assignedTreeActionTypes,
  assignedTreeReducer,
  assignedTreeSagas,
  watchAssignedTree,
} from 'ranger-redux/modules/submitTreeEvents/assignedTree';
import {assignedTreeRes} from 'ranger-redux/modules/__test__/submitTreeEvents/assignedTree.mock';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {currentTimestamp} from 'utilities/helpers/date';
import {handleSagaFetchError} from 'utilities/helpers/fetch';

describe('AssignedTree module', () => {
  it('AssignedTree module should be defined', () => {
    expect(assignedTreeReducer).toBeDefined();
    expect(assignedTreeActions).toBeDefined();
    expect(assignedTreeActionTypes).toBeDefined();
  });

  describe('AssignedTree sagas', () => {
    it('assignedTreeSagas should be defined', () => {
      expect(assignedTreeSagas).toBeDefined();
    });

    it('should yield assigned tree watcher', () => {
      const gen = assignedTreeSagas();

      assert.deepEqual(
        gen.next().value,
        takeEvery(assignedTreeActionTypes.load, watchAssignedTree),
        'it should yield watchAssignedTree',
      );
    });
  });

  describe('watchAssignedTree', () => {
    it('watchAssignedTree should be defined', () => {
      expect(watchAssignedTree).toBeDefined();
    });

    it('assigned tree success', () => {
      const date = currentTimestamp();

      const gen = watchAssignedTree({
        type: assignedTreeActionTypes.load,
        payload: {
          birthDate: date,
          signature: '',
          treeSpecsJSON: '',
          treeSpecs: '',
          treeId: 21,
        },
      });
      gen.next();
      const nextValue = {result: assignedTreeRes, status: 201};
      assert.deepEqual(
        gen.next(nextValue).value,
        put(assignedTreeActions.loadSuccess(assignedTreeRes)),
        'should dispatch assignedTreeActions success',
      );
    });
    it('assigned tree failure', () => {
      const date = currentTimestamp();

      const gen = watchAssignedTree({
        type: assignedTreeActionTypes.load,
        payload: {signature: '', treeSpecs: '', treeSpecsJSON: '', treeId: 21, birthDate: date},
      });
      const error = new Error('error is here');
      gen.next();
      assert.deepEqual(
        gen.throw(error).value,
        put(assignedTreeActions.loadFailure(error.message)),
        'should dispatch assignedTreeActions failure',
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
