import assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';

import {
  pendingTreeIdsActions,
  pendingTreeIdsActionTypes,
  pendingTreeIdsReducer,
  pendingTreeIdsSagas,
  watchPendingTreeIds,
} from 'ranger-redux/modules/trees/pendingTreeIds';
import {handleSagaFetchError} from 'utilities/helpers/fetch';
import {getProfile} from 'ranger-redux/modules/profile/profile';
import {mockProfile} from 'ranger-redux/modules/__test__/currentJourney/currentJourney.mock';
import {TUserStatus} from 'webServices/profile/profile';

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
    it('watchPendingTreeIds success, verified user', () => {
      const gen = watchPendingTreeIds();
      assert.deepEqual(gen.next().value, select(getProfile), 'should select profile data');
      gen.next({...mockProfile, result: [], status: 1});
      gen.next({result: ['12131'], status: 200, ...mockProfile});

      assert.deepEqual(
        gen.next({result: ['22324'], status: 200, ...mockProfile}).value,
        put(pendingTreeIdsActions.loadSuccess(['12131', '22324'])),
      );
    });
    it('watchPendingTreeIds success, not verified user', () => {
      const gen = watchPendingTreeIds();
      assert.deepEqual(gen.next().value, select(getProfile), 'should select profile data');

      assert.deepEqual(
        gen.next({...mockProfile, userStatus: TUserStatus.NotVerified, result: [], status: 1}).value,
        undefined,
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
