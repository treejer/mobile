import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  pendingTreeIdsActions,
  pendingTreeIdsActionTypes,
  pendingTreeIdsReducer,
  pendingTreeIdsSagas,
  watchPendingTreeIds,
} from 'ranger-redux/modules/trees/pendingTreeIds';
import {handleSagaFetchError} from 'utilities/helpers/fetch';

describe('pendingTreeIds module', () => {
  it('pendingTreeIds module should be defined', () => {
    expect(pendingTreeIdsReducer).toBeDefined();
    expect(pendingTreeIdsActions).toBeDefined();
    expect(pendingTreeIdsActionTypes).toBeDefined();
  });

  describe('pendingTreeIds sagas', () => {
    it('pendingTreeIds sagas should be defined', () => {
      expect(pendingTreeIdsSagas).toBeDefined();
    });
    it('pendingTreeIds sagas should yield pendingTreeIds watcher', () => {
      const gen = pendingTreeIdsSagas();
      assert.deepEqual(
        gen.next().value,
        takeEvery(pendingTreeIdsActionTypes.load, watchPendingTreeIds),
        'should yield pendingTreeIds watcher',
      );
    });
  });
  describe('watchPendingTreeIds', () => {
    it('watchPendingTreeIds should be defined', () => {
      expect(watchPendingTreeIds).toBeDefined();
    });
    it('watchPendingTreeIds success', () => {
      const gen = watchPendingTreeIds();
      gen.next();
      gen.next({result: ['12131'], status: 200});

      assert.deepEqual(
        gen.next({result: ['22324'], status: 200}).value,
        put(pendingTreeIdsActions.loadSuccess(['12131', '22324'])),
      );
    });
    it('watchPendingTreeIds failure', () => {
      const gen = watchPendingTreeIds();
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(pendingTreeIdsActions.loadFailure(error.message)));
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
    });
  });
});
