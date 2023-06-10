import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  profileActions,
  profileActionsTypes,
  profileReducer,
  profileSagas,
  watchProfile,
} from 'ranger-redux/modules/profile/profile';
import {mockProfile} from 'ranger-redux/modules/__test__/currentJourney/currentJourney.mock';
import {changeCheckMetaData} from 'ranger-redux/modules/settings/settings';

describe('profile module', () => {
  it('profile module should be defined', () => {
    expect(profileReducer).toBeDefined();
    expect(profileActions).toBeDefined();
    expect(profileActionsTypes).toBeDefined();
  });
  describe('profile sagas', () => {
    it('profile sagas should be defined', () => {
      expect(profileSagas).toBeDefined();
    });
    it('profile sagas should yield profile watcher', () => {
      const gen = profileSagas();
      assert.deepEqual(
        gen.next().value,
        takeEvery(profileActionsTypes.load, watchProfile),
        'should yield profile watcher',
      );
    });
  });
  describe('watchProfile', () => {
    it('watchProfile should be defined', () => {
      expect(watchProfile).toBeDefined();
    });
    it('watchProfile success', () => {
      const gen = watchProfile();
      gen.next();
      const nextValue = {result: mockProfile, status: 200};
      assert.deepEqual(
        gen.next(nextValue).value,
        put(changeCheckMetaData(true)),
        'should dispatch changeCheckMetaData to set true',
      );
      assert.deepEqual(
        gen.next(nextValue).value,
        put(profileActions.loadSuccess(mockProfile)),
        'should dispatch profileActions success',
      );
    });
    it('watchProfile failure', () => {
      const gen = watchProfile();
      gen.next();
      const error = new Error('error is here!');

      assert.deepEqual(
        gen.throw(error).value,
        put(profileActions.loadFailure(error.message)),
        'should dispatch profileActions failure',
      );
    });
  });
});
